# Usage: mitmdump -s "signatureBasedActiveAdblocker.py"
# (this script works best with --anticache)
# mitmproxy version 1.0.2
import re
import csv
import sys

csv.field_size_limit(sys.maxsize)


# load the filters from filterList.csv, which is a CSV file containing 3
# fields: a regular expression for the websites to match and two strings
# to pass to the python replace function; the first the old string and
# the second the new string
rules = []
with open('filterList.csv') as csvfile:
	reader = csv.reader(csvfile, doublequote=False, escapechar='\\')
	for row in reader:
		# ignore comments
		if (len(row) > 0) and not(row[0][0] == "#"):
				rule = {"urlPattern": row[0], "old": row[1], "new": row[2]}
				rule["urlRegex"] = re.compile(rule["urlPattern"]);
				rules.append(rule)


# handle responses
def response(flow):
	# grab the request URL and response
	requestURL = flow.request.url;
	res = flow.response;
	# run through each rule and determine if the url matches the rule's
	# pattern.
	for rule in rules:
		if (rule["urlRegex"].match(requestURL)):
			# if it matches, run the given regex replacement.
			try:
				decoded = res.content.decode("utf-8")
				newContent = decoded.replace(rule["old"], rule["new"])
				res.content = newContent.encode("utf-8")
			except UnicodeDecodeError:
				decoded = res.content.decode("iso-8859-1")
				newContent = decoded.replace(rule["old"], rule["new"])
				res.content = newContent.encode("iso-8859-1")
