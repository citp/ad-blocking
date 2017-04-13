Components.utils.import("resource://gre/modules/Services.jsm");

var branch = "extensions.activeadblock.";
var fArray, treeVis = [], isSaved = true;

var treeView = {
	treeBox : null,
	selection : null,

	get rowCount() {
		return treeVis.length;
	},
	setTree : function (treeBox) {
		this.treeBox = treeBox;
	},
	getCellText : function (idx, column) {
		switch (treeVis[idx][0]) {
			case 0:
				if (column.id == "search") {
					return fArray[treeVis[idx][3]][0];
				} else {
					return "";
				}
				break;
			case 1:
				if (column.id == "search") {
					return fArray[treeVis[idx][3]][treeVis[idx][4]][0];
				} else {
					return "";
				}
				break;
			case 2:
				if (column.id == "search") {
					return fArray[treeVis[idx][3]][treeVis[idx][4]][1][treeVis[idx][5]];
				} else {
					return fArray[treeVis[idx][3]][treeVis[idx][4]][1][treeVis[idx][5]+1];
				}
				break;
		}
	},
	isContainer : function (idx) {
		return treeVis[idx][1];
	},
	isContainerOpen : function (idx) {
		return treeVis[idx][2];
	},
	isContainerEmpty : function (idx) {
		return false;
	},
	isSeparator : function (idx) {
		return false;
	},
	isSorted : function () {
		return false;
	},
	isEditable : function (idx, column) {
		return false;
	},

	getParentIndex : function (idx) {
		if (this.isContainer(idx))
			return -1;
		for (var t = idx - 1; t >= 0; t--) {
			if (this.isContainer(t))
				return t;
		}
	},
	getLevel : function (idx) {
		return treeVis[idx][0];
	},
	hasNextSibling : function (idx, after) {
		var thisLevel = this.getLevel(idx);
		for (var t = after + 1; t < treeVis.length; t++) {
			var nextLevel = this.getLevel(t);
			if (nextLevel == thisLevel)
				return true;
			if (nextLevel < thisLevel)
				break;
		}
		return false;
	},
	toggleOpenState : function (idx) {
		var item = treeVis[idx];
		if (!item[1])
			return;

		if (item[2]) {
			item[2] = false;

			var thisLevel = this.getLevel(idx);
			var deletecount = 0;
			for (var t = idx + 1; t < treeVis.length; t++) {
				if (this.getLevel(t) > thisLevel)
					deletecount++;
				else
					break;
			}
			if (deletecount) {
				treeVis.splice(idx + 1, deletecount);
				this.treeBox.rowCountChanged(idx + 1, -deletecount);
			}
		} else {
			item[2] = true;

			switch (item[0]) {
				case 0:
					for (var j=1; j < fArray[item[3]].length; j++) {
						treeVis.splice(idx + j, 0, [1, true, false, item[3], j, 0]);
					}
					this.treeBox.rowCountChanged(idx + 1, fArray[item[3]].length - 1);
					break;
				case 1:
					for (var k=0, i=0; k < fArray[item[3]][item[4]][1].length; k++) {
						treeVis.splice(idx + i++ + 1, 0, [2, false, false, item[3], item[4], k++]);
					}
					this.treeBox.rowCountChanged(idx + 1, i);
					break;
			}
		}
		this.treeBox.invalidateRow(idx);
	},
	selectionChanged : function () {
		var ci = this.selection.currentIndex;
		if (ci == -1) return;
		var sbox = document.getElementById("editsearch");
		var rbox = document.getElementById("editreplace");
		switch (treeVis[ci][0]) {
			case 0:
				sbox.value = fArray[treeVis[ci][3]][0];
				if (sbox.hasAttribute("disabled")) sbox.removeAttribute("disabled");
				rbox.value = ""; if (!rbox.hasAttribute("disabled")) rbox.setAttribute("disabled","true");
				break;
			case 1:
				sbox.value = fArray[treeVis[ci][3]][treeVis[ci][4]][0];
				if (sbox.hasAttribute("disabled")) sbox.removeAttribute("disabled");
				rbox.value = ""; if (!rbox.hasAttribute("disabled")) rbox.setAttribute("disabled","true");
				break;
			case 2:
				sbox.value = fArray[treeVis[ci][3]][treeVis[ci][4]][1][treeVis[ci][5]];
				if (sbox.hasAttribute("disabled")) sbox.removeAttribute("disabled");
				rbox.value = fArray[treeVis[ci][3]][treeVis[ci][4]][1][treeVis[ci][5]+1];
				if (rbox.hasAttribute("disabled")) rbox.removeAttribute("disabled");
				break;
		}
	},
	getImageSrc : function (idx, column) {},
	getProgressMode : function (idx, column) {},
	getCellValue : function (idx, column) {},
	cycleHeader : function (col, elem) {},
	cycleCell : function (idx, column) {},
	performAction : function (action) {},
	performActionOnCell : function (action, index, column) {},
	getRowProperties : function (idx, prop) {},
	getCellProperties : function (idx, column, prop) {},
	getColumnProperties : function (column, element, prop) {},
};

function init() {
	reloadFilters(false);
	document.getElementById("elementList").view = treeView;
	window.onbeforeunload = function (e) {
		if (isSaved) return;
		return false;
	}
}

function reloadFilters(reload) {
	if (reload && !isSaved && !Services.prompt.confirm(null, "Reload filters?", "Do you want to reload all filters?\nWarning! Unsaved data will be lost!")) return;
	var filter = Services.prefs.getBranch(branch).getCharPref("filter");
	try {
		fArray = JSON.parse(filter);
	} catch(e) {
		fArray = [];
		if (filter != "") Services.prompt.alert(null, "Error loading filters!", e);
	}
	if (reload) {
		treeView.treeBox.beginUpdateBatch();
		var oldLength = treeVis.length;
		treeVis.splice(0, oldLength);
		treeView.treeBox.rowCountChanged(0, -oldLength);
	}
	for (var i=0; i < fArray.length; i++) {
//			[ treeLevel, isContainer, isContainerOpen, i, j, k ]
		treeVis.push([0, true, false, i, 0, 0]);
	}
	if (reload) {
		treeView.treeBox.rowCountChanged(0, fArray.length);
		treeView.treeBox.endUpdateBatch();
		var sbox = document.getElementById("editsearch"); sbox.value = "";
		var rbox = document.getElementById("editreplace"); rbox.value = "";
		if (!sbox.hasAttribute("disabled")) sbox.setAttribute("disabled","true");
		if (!rbox.hasAttribute("disabled")) rbox.setAttribute("disabled","true");
	}
	document.getElementById("elementList").focus();
	isSaved = true;
}

function updateFilters() {
	if (!Services.prompt.confirm(null, "Save filters?", "Do you want to save filters?")) return;
	try {
		var filterString = JSON.stringify(fArray);
		if (filterString == "[]") filterString = "";
		Services.prefs.getBranch(branch).setCharPref("filter", filterString);
		Services.prefs.getBranch(branch).setBoolPref("enabled", false);
		isSaved = true;
		var check = {value: Services.prefs.getBoolPref("extensions.activeadblock.closeEditor")};
		if (Services.prompt.confirmCheck(null, "Enable filters?", "Enable saved filters now?", "Close Editor", check)) {
			Services.prefs.getBranch(branch).setBoolPref("enabled", true);
			if (check.value) closeEditor();
		}
		Services.prefs.setBoolPref("extensions.activeadblock.closeEditor", check.value);
	} catch (e) {
		Services.prompt.alert(null, "Error!", e);
	}
}

function closeEditor() {
	var win = window;
	var mrw = Services.wm.getMostRecentWindow("navigator:browser");
	if (typeof mrw.BrowserOpenAddonsMgr != "undefined") {
		mrw.BrowserOpenAddonsMgr("addons://detail/activeadblock@Grant.Storey/preferences");
	} else if (typeof mrw.BrowserApp != "undefined") {
		mrw.BrowserApp.selectOrAddTab("about:addons");
	} else if (typeof mrw.toEM != "undefined") {
		mrw.toEM("addons://detail/activeadblock@Grant.Storey/preferences");
	}
	win.close();
}

function deleteRow() {
	var ci = treeView.selection.currentIndex;
	if (ci == -1) return;
	if (!Services.prompt.confirm(null, "Delete rule?", "Do you want to delete selected rule?")) return;
	switch (treeVis[ci][0]) {
		case 0:
			fArray.splice([treeVis[ci][3]], 1);
			var deletecount = 0;
			for (var t = ci + 1; t < treeVis.length; t++) {
				if (treeVis[t][0] > 0)
					deletecount++;
				else
					break;
			}
			treeVis.splice(ci, ++deletecount);
			treeView.treeBox.rowCountChanged(ci, -deletecount);
			for (var i = ci; i < treeVis.length; i++) {
				treeVis[i][3] = treeVis[i][3] - 1;
			}
			break;
		case 1:
			if (fArray[treeVis[ci][3]].length == 2) return;
			fArray[treeVis[ci][3]].splice([treeVis[ci][4]], 1);
			var deletecount = 0;
			for (var t = ci + 1; t < treeVis.length; t++) {
				if (treeVis[t][0] > 1)
					deletecount++;
				else
					break;
			}
			treeVis.splice(ci, ++deletecount);
			treeView.treeBox.rowCountChanged(ci, -deletecount);
			for (var i = ci; i < treeVis.length; i++) {
				if (treeVis[i][0] >= 1) {
					treeVis[i][4] = treeVis[i][4] - 1;
				} else 
					break;
			}
			break;
		case 2:
			if (fArray[treeVis[ci][3]][treeVis[ci][4]][1].length == 2) return;
			fArray[treeVis[ci][3]][treeVis[ci][4]][1].splice([treeVis[ci][5]], 2);
			treeVis.splice(ci, 1);
			treeView.treeBox.rowCountChanged(ci, -1);
			for (var i = ci; i < treeVis.length; i++) {
				if (treeVis[i][0] == 2) {
					treeVis[i][5] = treeVis[i][5] - 2;
				} else 
					break;
			}
			break;
	}
	document.getElementById("elementList").focus();
	isSaved = false;
	var sbox = document.getElementById("editsearch"); sbox.value = "";
	var rbox = document.getElementById("editreplace"); rbox.value = "";
	if (!sbox.hasAttribute("disabled")) sbox.setAttribute("disabled","true");
	if (!rbox.hasAttribute("disabled")) rbox.setAttribute("disabled","true");
}

function addRow() {
	var ci = treeView.selection.currentIndex;
	if (ci == -1) {
		level = 0;
	} else {
		level = treeVis[ci][0];
	}
	switch (level) {
		case 0:
			fArray.push(["host",["path",["search","replace"]]]);
			treeVis.push([0, true, false, fArray.length - 1, 0, 0]);
			treeView.treeBox.rowCountChanged(treeVis.length, 1);
			break;
		case 1:
			fArray[treeVis[ci][3]].push(["path",["search","replace"]]);
			var pos = 0;
			for (var t = ci + 1; t < treeVis.length; t++) {
				if (treeVis[t][0] > 0)
					pos++;
				else
					break;
			}
			treeVis.splice(ci+pos+1, 0, [1, true, false, treeVis[ci][3], fArray[treeVis[ci][3]].length - 1, 0]);
			treeView.treeBox.rowCountChanged(ci+pos, 1);
			break;
		case 2:
			fArray[treeVis[ci][3]][treeVis[ci][4]][1].push("search");
			fArray[treeVis[ci][3]][treeVis[ci][4]][1].push("replace");
			var pos = 0;
			for (var t = ci + 1; t < treeVis.length; t++) {
				if (treeVis[t][0] > 1)
					pos++;
				else
					break;
			}
			treeVis.splice(ci+pos+1, 0, [2, false, false, treeVis[ci][3], treeVis[ci][4], fArray[treeVis[ci][3]][treeVis[ci][4]][1].length - 2]);
			treeView.treeBox.rowCountChanged(ci+pos, 1);
			break;
	}
	document.getElementById("elementList").focus();
	isSaved = false;
}

function updateCell(str, col) {
	var ci = treeView.selection.currentIndex;
	if (ci == -1) return;
	switch (treeVis[ci][0]) {
		case 0:
			fArray[treeVis[ci][3]][0] = str.value;
			break;
		case 1:
			fArray[treeVis[ci][3]][treeVis[ci][4]][0] = str.value;
			break;
		case 2:
			fArray[treeVis[ci][3]][treeVis[ci][4]][1][treeVis[ci][5]+col] = str.value;
			break;
	}
	treeView.treeBox.invalidateRow(ci);
	isSaved = false;
}
