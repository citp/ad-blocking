/* ----------------------------------------------------------------------------------
 * Author: Grant Storey & Dillon Reisman
 * Written: 8/15/16
 * Last Updated: 8/15/16
 * Description: Contains a map between locale codes and the corresponding
 * "Sponsored" text, as well as a default list if the locale cannot be
 * determined.
 * ----------------------------------------------------------------------------------
 */

// all locales accessible to me on facebook.
var TEXT_POSSIBILITIES_DEFAULT = [
"\u0110\u01B0\u1EE3c t\u00E0i tr\u1EE3", // (Được tài trợ) Vietnamese
"\u03A7\u03BF\u03C1\u03B7\u03B3\u03BF\u03CD\u03BC\u03B5\u03BD\u03B7", // (Χορηγούμενη) Greek
"\u0411\u043E \u0441\u0430\u0440\u043F\u0430\u0440\u0430\u0441\u0442\u04E3", // (Бо сарпарастӣ) Tajik
"\u0414\u0435\u043C\u0435\u0443\u0448\u0456\u043B\u0456\u043A \u043A\u04E9\u0440\u0441\u0435\u0442\u043A\u0435\u043D", // (Демеушілік көрсеткен) Kazakh
"\u0418\u0432\u044D\u044D\u043D \u0442\u044D\u0442\u0433\u044D\u0441\u044D\u043D", // (Ивээн тэтгэсэн) Mongolian
"\u0420\u0435\u043A\u043B\u0430\u043C\u0430", // (Реклама) Russian, Ukranian
"\u0420\u044D\u043A\u043B\u0430\u043C\u0430", // (Рэклама) Belarusian
"\u0421\u043F\u043E\u043D\u0437\u043E\u0440\u0438\u0440\u0430\u043D\u043E", // (Спонзорирано) Macedonian
"\u0421\u043F\u043E\u043D\u0437\u043E\u0440\u0438\u0441\u0430\u043D\u043E", // (Спонзорисано) Serbian
"\u0421\u043F\u043E\u043D\u0441\u043E\u0440\u0438\u0440\u0430\u043D\u043E", // (Спонсорирано) Bulgarian
"\u0533\u0578\u057E\u0561\u0566\u0564\u0561\u0575\u056B\u0576", // (Գովազդային) Armenian
"\u05D1\u05D7\u05E1\u05D5\u05EA", // (בחסות) Hebrew
"\u0625\u0639\u0644\u0627\u0646 \u0645\u064F\u0645\u0648\u0651\u064E\u0644", // (إعلان مُموَّل) Arabic
"\u062A\u0639\u0627\u0648\u0646 \u06A9\u0631\u062F\u06C1", // (تعاون کردہ) Urdu
"\u062A\u0645\u0648\u064A\u0644 \u0634\u0648\u064A", // (تمويل شوي) Pashto
"\u062F\u0627\u0631\u0627\u06CC \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0645\u0627\u0644\u06CC", // (دارای پشتیبانی مالی) Farsi
"\u067E\u0627\u06B5\u067E\u0634\u062A\u06CC\u06A9\u0631\u0627\u0648", // (پاڵپشتیکراو) Sorani Kurdish
"\u0712\u0718\u0715\u0729\u0710 \u0721\u0721\u0718\u0718\u0722\u0710", // (browser cannot render) Syriac
"\u092A\u094D\u0930\u093E\u092F\u094B\u091C\u093F\u0924", // (प्रायोजित) Hindi, Marathi, Nepali
"\u09AA\u09C3\u09B7\u09CD\u09A0\u09AA\u09CB\u09B7\u0995\u09A4\u09BE \u0995\u09F0\u09BE", // (পৃষ্ঠপোষকতা কৰা) Assamese
"\u09B8\u09CC\u099C\u09A8\u09CD\u09AF\u09C7", // (সৌজন্যে) Bengali
"\u0A38\u0A30\u0A2A\u0A4D\u0A30\u0A38\u0A24\u0A40 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24", // (ਸਰਪ੍ਰਸਤੀ ਪ੍ਰਾਪਤ) Punjabi
"\u0AAA\u0ACD\u0AB0\u0ABE\u0AAF\u0ACB\u0A9C\u0ABF\u0AA4", // (પ્રાયોજિત) Gujarati
"\u0B2A\u0B4D\u0B30\u0B2F\u0B4B\u0B1C\u0B3F\u0B24", // (ପ୍ରଯୋଜିତ) Oriya
"\u0BB8\u0BCD\u0BAA\u0BBE\u0BA9\u0BCD\u0BB8\u0BB0\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1", // (ஸ்பான்ஸர் செய்யப்பட்டது) Tamil
"\u0C38\u0C4D\u0C2A\u0C3E\u0C28\u0C4D\u0C38\u0C30\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C28\u0C35\u0C3F", // (స్పాన్సర్ చేసినవి) Telegu
"\u0CAA\u0CCD\u0CB0\u0CBE\u0CAF\u0CCB\u0C9C\u0CBF\u0CA4", // (ಪ್ರಾಯೋಜಿತ) Kannada
"\u0D38\u0D4D\u0D2A\u0D4B\u0D7A\u0D38\u0D7C \u0D1A\u0D46\u0D2F\u0D4D\u0D24\u0D24\u0D4D", // (സ്പോൺസർ ചെയ്തത്) Malayalam
"\u0D85\u0DB1\u0DD4\u0D9C\u0DCA\u200D\u0DBB\u0DC4\u0DBA \u0DAF\u0D9A\u0DCA\u0DC0\u0DB1 \u0DBD\u0DAF", // (අනුග්‍රහය දක්වන ලද) Sinhalese
"\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E2A\u0E19\u0E31\u0E1A\u0E2A\u0E19\u0E38\u0E19", // (ได้รับการสนับสนุน) Thai
"\u1015\u1036\u1037\u1015\u102D\u102F\u1038\u1011\u102C\u1038\u101E\u100A\u103A", // (ပံ့ပိုးထားသည်) Burmese
"\u10E0\u10D4\u10D9\u10DA\u10D0\u10DB\u10D0", // (რეკლამა) Georgian
"\u1794\u17B6\u1793\u17A7\u1794\u178F\u17D2\u1790\u1798\u17D2\u1797", // (បានឧបត្ថម្ភ) Khmer
"\u2D49\u2D37\u2D4D", // (browser cannot render) Tamazight
"\u5E83\u544A", // (広告) Japanese (Standard, Kansai)
"\u8D0A\u52A9", // (贊助) Chinese (Traditional) (Hong Kong, Taiwan)
"\u8D5E\u52A9\u5185\u5BB9", // (赞助内容) Chinese (Simplified)
"5p4m", // Leet Speak
"Apmaks\u0101ta rekl\u0101ma", // (Apmaksāta reklāma) Latvian
"Babestua", // Basque
"Bersponsor", // Indonesian
"Chartered", // Pirate
"Commandit\u00E9", // (Commandité) French (Canada)
"Daukar Nauyi", // Hausa
"Disponsori", // Javanese
"Ditaja", // Malay
"Expensum", // Latin
"Geborg", // Afrikaans
"Gesponsert", // German
"Gesponsord", // Dutch, Belgian Dutch
"Giisponsoran", // Bisaya
"Hirdet\u00E9s", // (Hirdetés) Hungarian
"Icyamamaza ndasukirwaho", // Kinyarwanda
"Imedhaminiwa", // Swahili
"Kosta\u00F0", // (Kostað) Icelandic
"La maalgeliyey", // Somali
"May Sponsor", // Filipino
"Misy mpanohana", // Malagasy
"O\u00F1epatrosinapyre", // (Oñepatrosinapyre) Guarani
"p\u0259\u0279osuodS", // (pəɹosuodS) English (Upside Down)
"Paeroniet", // Breton
"Patrocinado", // Galician, Portuguese (Brasil, Portugal), Spanish (Columbia)
"Patrocinat", // Catalan
"Patronadu de:", // Sardinian
"Pla\u0107eni oglas", // (Plaćeni oglas) Croation
"Publicidad", // Spanish (Standard, Spain)
"R\u0117m\u0117jai", // (Rėmėjai) Lithuanian
"Reklama", // Uzbek
"Sponsa", // Norwegian (Nynorsk)
"Sponset", // Norwegian (Bokmal)
"Sponsitud", // Estonian
"Sponsor d\u0259st\u0259kli", // (Sponsor dəstəkli) Azerbaijani
"Sponsore", // Western Frisian
"Sponsored", // English (UK, US), Korean
"Sponsoreret", // Danish
"Sponsoris\u00E9", // (Sponsorisé) French (France)
"Sponsorita", // Esperanto
"Sponsorizat", // Romanian
"Sponsorizuar", // Albanian
"Sponsorizzata", // Italian
"Sponsorkir\u00EE", // (Sponsorkirî) Northern Kurdish
"Sponsorlu", // Turkish
"Sponsoroitu", // Finnish
"Sponsorowane", // Polish
"Sponsrad", // Swedish
"Sponzorirano", // Bosnian, Slovenian
"Sponzorov\u00E1no", // (Sponzorováno) Czech
"Sponzorovan\u00E9", // (Sponzorované) Slovak
"Stu\u00F0la\u00F0", // (Stuðlað) Faroese
"Szp\u014Dnzorowane", // (Szpōnzorowane) Silesian
"Urraithe" // Irish
];

var LOCALE_MAP = {
"so_SO": "La maalgeliyey", // Somali; works as of 8/15/16
"af_ZA": "Geborg", // Afrikaans; works as of 8/15/16
"az_AZ": "Sponsor d\u0259st\u0259kli", // (Sponsor dəstəkli) Azerbaijani; works as of 8/15/16
"id_ID": "Bersponsor", // Indonesian; works as of 8/15/16
"ms_MY": "Ditaja", // Malay; works as of 8/15/16
"jv_ID": "Disponsori", // Javanese; works as of 8/15/16
"cx_PH": "Giisponsoran", // Bisaya; works as of 8/15/16
"bs_BA": "Sponzorirano", // Bosnian; works as of 8/15/16
"br_FR": "Paeroniet", // Breton; works as of 8/15/16
"ca_ES": "Patrocinat", // Catalan; works as of 8/15/16
"cs_CZ": "Sponzorov\u00E1no", // (Sponzorováno) Czech; works as of 8/15/16
"da_DK": "Sponsoreret", // Danish; works as of 8/15/16
"de_DE": "Gesponsert", // German; works as of 8/15/16
"et_EE": "Sponsitud", // Estonian; works as of 8/15/16
"en_PI": "Chartered", // Pirate; works as of 8/15/16
"en_GB": "Sponsored", // English (UK); works as of 8/15/16
"en_US": "Sponsored", // English (US); works as of 8/15/16
"en_UD": "p\u0259\u0279osuodS", // (pəɹosuodS) English (Upside Down); works as of 8/15/16
"es_LA": "Publicidad", // Spanish; works as of 8/15/16
"es_CO": "Patrocinado", // Spanish (Columbia); works as of 8/15/16
"es_ES": "Publicidad", // Spanish (Spain); works as of 8/15/16
"eo_EO": "Sponsorita", // Esperanto; works as of 8/15/16
"eu_ES": "Babestua", // Basque; works as of 8/15/16
"tl_PH": "May Sponsor", // Filipino; works as of 8/15/16
"fr_CA": "Commandit\u00E9", // (Commandité) French (Canada); works as of 8/15/16
"fr_FR": "Sponsoris\u00E9", // (Sponsorisé) French (France); works as of 8/15/16
"fy_NL": "Sponsore", // Western Frisian; works as of 8/15/16
"fo_FO": "Stu\u00F0la\u00F0", // (Stuðlað) Faroese; works as of 8/15/16
"ga_IE": "Urraithe", // Irish; works as of 8/15/16
"gl_ES": "Patrocinado", // Galician; works as of 8/15/16
"gn_PY": "O\u00F1epatrosinapyre", // (Oñepatrosinapyre) Guarani; works as of 8/15/16
"ha_NG": "Daukar Nauyi", // Hausa; works as of 8/15/16
"hr_HR": "Pla\u0107eni oglas", // (Plaćeni oglas) Croatian; works as of 8/15/16
"rw_RW": "Icyamamaza ndasukirwaho", // Kinyarwanda; works as of 8/15/16
"is_IS": "Kosta\u00F0", // (Kostað) Icelandic; works as of 8/15/16
"it_IT": "Sponsorizzata", // Italian; works as of 8/15/16
"sw_KE": "Imedhaminiwa", // Swahili; works as of 8/15/16
"ku_TR": "Sponsorkir\u00EE", // (Sponsorkirî) Northern Kurdish; works as of 8/15/16
"lv_LV": "Apmaks\u0101ta rekl\u0101ma", // (Apmaksāta reklāma) Latvian; works as of 8/15/16
"fb_LT": "5p4m", // Leet Speak - particularly funny that they literally just call it "spam"; works as of 8/15/16
"lt_LT": "R\u0117m\u0117jai", // (Rėmėjai) Lithuanian; works as of 8/15/16
"la_VA": "Expensum", // Latin; works as of 8/15/16
"hu_HU": "Hirdet\u00E9s", // (Hirdetés) Hungarian; works as of 8/15/16
"mg_MG": "Misy mpanohana", // Malagasy; works as of 8/15/16
"nl_NL": "Gesponsord", // Dutch; works as of 8/15/16
"nl_BE": "Gesponsord", // Dutch (Belgian); works as of 8/15/16
"nb_NO": "Sponset", // Norwegian (Bokmal); works as of 8/15/16
"nn_NO": "Sponsa", // Norwegian (Nynorsk); works as of 8/15/16
"uz_UZ": "Reklama", // Uzbek; works as of 8/15/16
"pl_PL": "Sponsorowane", // Polish; works as of 8/15/16
"pt_BR": "Patrocinado", // Portuguese (Brasil); works as of 8/15/16
"pt_PT": "Patrocinado", // Portuguese (Portugal); works as of 8/15/16
"ro_RO": "Sponsorizat", // Romanian; works as of 8/15/16
"sc_IT": "Patronadu de:", // Sardinian; works as of 8/15/16
"sq_AL": "Sponsorizuar", // Albanian; works as of 8/15/16
"sz_PL": "Szp\u014Dnzorowane", // (Szpōnzorowane) Silesian; works as of 8/15/16
"sk_SK": "Sponzorovan\u00E9", // (Sponzorované) Slovak; works as of 8/15/16
"sl_SI": "Sponzorirano", // Slovenian; works as of 8/15/16
"fi_FI": "Sponsoroitu", // Finnish; works as of 8/15/16
"sv_SE": "Sponsrad", // Swedish; works as of 8/15/16
"vi_VN": "\u0110\u01B0\u1EE3c t\u00E0i tr\u1EE3", // (Được tài trợ) Vietnamese; works as of 8/15/16
"tr_TR": "Sponsorlu", // Turkish; works as of 8/15/16
"el_GR": "\u03A7\u03BF\u03C1\u03B7\u03B3\u03BF\u03CD\u03BC\u03B5\u03BD\u03B7", // (Χορηγούμενη) Greek; works as of 8/15/16
"be_BY": "\u0420\u044D\u043A\u043B\u0430\u043C\u0430", // (Рэклама) Belarusian; works as of 8/15/16
"bg_BG": "\u0421\u043F\u043E\u043D\u0441\u043E\u0440\u0438\u0440\u0430\u043D\u043E", // (Спонсорирано) Bulgarian; works as of 8/15/16
"kk_KZ": "\u0414\u0435\u043C\u0435\u0443\u0448\u0456\u043B\u0456\u043A \u043A\u04E9\u0440\u0441\u0435\u0442\u043A\u0435\u043D", // (Демеушілік көрсеткен) Kazakh; works as of 8/15/16
"mk_MK": "\u0421\u043F\u043E\u043D\u0437\u043E\u0440\u0438\u0440\u0430\u043D\u043E", // (Спонзорирано) Macedonian; works as of 8/15/16
"mn_MN": "\u0418\u0432\u044D\u044D\u043D \u0442\u044D\u0442\u0433\u044D\u0441\u044D\u043D", // (Ивээн тэтгэсэн) Mongolian; works as of 8/15/16
"ru_RU": "\u0420\u0435\u043A\u043B\u0430\u043C\u0430", // (Реклама) Russian; works as of 8/15/16
"sr_RS": "\u0421\u043F\u043E\u043D\u0437\u043E\u0440\u0438\u0441\u0430\u043D\u043E", // (Спонзорисано) Serbian; works as of 8/15/16
"tg_TJ": "\u0411\u043E \u0441\u0430\u0440\u043F\u0430\u0440\u0430\u0441\u0442\u04E3", // (Бо сарпарастӣ) Tajik; works as of 8/15/16
"uk_UA": "\u0420\u0435\u043A\u043B\u0430\u043C\u0430", // (Реклама) Ukranian; works as of 8/15/16
"ka_GE": "\u10E0\u10D4\u10D9\u10DA\u10D0\u10DB\u10D0", // (რეკლამა) Georgian; works as of 8/15/16
"hy_AM": "\u0533\u0578\u057E\u0561\u0566\u0564\u0561\u0575\u056B\u0576", // (Գովազդային) Armenian; works as of 8/15/16
"he_IL": "\u05D1\u05D7\u05E1\u05D5\u05EA", // (בחסות) Hebrew; works as of 8/15/16
"ur_PK": "\u062A\u0639\u0627\u0648\u0646 \u06A9\u0631\u062F\u06C1", // (تعاون کردہ) Urdu; works as of 8/15/16
"ar_AR": "\u0625\u0639\u0644\u0627\u0646 \u0645\u064F\u0645\u0648\u0651\u064E\u0644", // (إعلان مُموَّل) Arabic; works as of 8/15/16
"ps_AF": "\u062A\u0645\u0648\u064A\u0644 \u0634\u0648\u064A", // (تمويل شوي) Pashto; works as of 8/15/16
"fa_IR": "\u062F\u0627\u0631\u0627\u06CC \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0645\u0627\u0644\u06CC", // (دارای پشتیبانی مالی) Farsi; works as of 8/15/16
"cb_IQ": "\u067E\u0627\u06B5\u067E\u0634\u062A\u06CC\u06A9\u0631\u0627\u0648", // (پاڵپشتیکراو) Sorani Kurdish; works as of 8/15/16
"sy_SY": "\u0712\u0718\u0715\u0729\u0710 \u0721\u0721\u0718\u0718\u0722\u0710", // (browser cannot render) Syriac; works as of 8/15/16
"tz_MA": "\u2D49\u2D37\u2D4D", // (browser cannot render) Tamazight; works as of 8/15/16
"ne_NP": "\u092A\u094D\u0930\u093E\u092F\u094B\u091C\u093F\u0924", // (प्रायोजित) Nepali; works as of 8/15/16
"mr_IN": "\u092A\u094D\u0930\u093E\u092F\u094B\u091C\u093F\u0924", // (प्रायोजित) Marathi; works as of 8/15/16
"hi_IN": "\u092A\u094D\u0930\u093E\u092F\u094B\u091C\u093F\u0924", // (प्रायोजित) Hindi; works as of 8/15/16
"as_IN": "\u09AA\u09C3\u09B7\u09CD\u09A0\u09AA\u09CB\u09B7\u0995\u09A4\u09BE \u0995\u09F0\u09BE", // (পৃষ্ঠপোষকতা কৰা) Assamese; works as of 8/15/16
"bn_IN": "\u09B8\u09CC\u099C\u09A8\u09CD\u09AF\u09C7", // (সৌজন্যে) Bengali; works as of 8/15/16
"pa_IN": "\u0A38\u0A30\u0A2A\u0A4D\u0A30\u0A38\u0A24\u0A40 \u0A2A\u0A4D\u0A30\u0A3E\u0A2A\u0A24", // (ਸਰਪ੍ਰਸਤੀ ਪ੍ਰਾਪਤ) Punjabi; works as of 8/15/16
"gu_IN": "\u0AAA\u0ACD\u0AB0\u0ABE\u0AAF\u0ACB\u0A9C\u0ABF\u0AA4", // (પ્રાયોજિત) Gujarati; works as of 8/15/16
"or_IN": "\u0B2A\u0B4D\u0B30\u0B2F\u0B4B\u0B1C\u0B3F\u0B24", // (ପ୍ରଯୋଜିତ) Oriya; works as of 8/15/16
"ta_IN": "\u0BB8\u0BCD\u0BAA\u0BBE\u0BA9\u0BCD\u0BB8\u0BB0\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1", // (ஸ்பான்ஸர் செய்யப்பட்டது) Tamil; works as of 8/15/16
"te_IN": "\u0C38\u0C4D\u0C2A\u0C3E\u0C28\u0C4D\u0C38\u0C30\u0C4D \u0C1A\u0C47\u0C38\u0C3F\u0C28\u0C35\u0C3F", // (స్పాన్సర్ చేసినవి) Telegu; works as of 8/15/16
"kn_IN": "\u0CAA\u0CCD\u0CB0\u0CBE\u0CAF\u0CCB\u0C9C\u0CBF\u0CA4", // (ಪ್ರಾಯೋಜಿತ) Kannada; works as of 8/15/16
"ml_IN": "\u0D38\u0D4D\u0D2A\u0D4B\u0D7A\u0D38\u0D7C \u0D1A\u0D46\u0D2F\u0D4D\u0D24\u0D24\u0D4D", // (സ്പോൺസർ ചെയ്തത്) Malayalam; works as of 8/15/16
"si_LK": "\u0D85\u0DB1\u0DD4\u0D9C\u0DCA\u200D\u0DBB\u0DC4\u0DBA \u0DAF\u0D9A\u0DCA\u0DC0\u0DB1 \u0DBD\u0DAF", // (අනුග්‍රහය දක්වන ලද) Sinhalese; works as of 8/15/16
"th_TH": "\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E2A\u0E19\u0E31\u0E1A\u0E2A\u0E19\u0E38\u0E19", // (ได้รับการสนับสนุน) Thai; works as of 8/15/16
"my_MM": "\u1015\u1036\u1037\u1015\u102D\u102F\u1038\u1011\u102C\u1038\u101E\u100A\u103A", // (ပံ့ပိုးထားသည်) Burmese; works as of 8/15/16
"km_KH": "\u1794\u17B6\u1793\u17A7\u1794\u178F\u17D2\u1790\u1798\u17D2\u1797", // (បានឧបត្ថម្ភ) Khmer; works as of 8/15/16
"ko_KR": "Sponsored", // Korean - while most text is Korean, for ads it literally just says "Sponsored" in English; works as of 8/15/16
"ja_JP": "\u5E83\u544A", // (広告) Japanese; works as of 8/15/16
"ja_KS": "\u5E83\u544A", // (広告) Japanese (Kansai); works as of 8/15/16
"zh_CN": "\u8D5E\u52A9\u5185\u5BB9", // (赞助内容) Chinese (Simplified); works as of 8/15/16
"zh_TW": "\u8D0A\u52A9", // (贊助) Chinese (Taiwan); works as of 8/15/16
"zh_HK": "\u8D0A\u52A9" // (贊助) Chinese (Hong Kong); works as of 8/15/16
};
//*/


// Stores whether we are in a non-english locale
var NON_ENGLISH_LOCALE = false;


// use the source code to determine the locale, and if it is in the list,
// narrow down the number of possible "sponsored" text strings
function getLocale() {
  var allHTML = $("html").html();
  var myRe = /\"locale\":\"([^\"]+)\"/g;
  var resultArray = myRe.exec(allHTML);
  if (resultArray && resultArray.length >= 2) {
    var localeCode = resultArray[1];
    if (VERBOSE) {
      console.log(localeCode);
    }
    if (!((localeCode == "en_PI") || (localeCode == "en_US") || (localeCode == "en_UK"))) {
      NON_ENGLISH_LOCALE = true;
    }
    if (localeCode in LOCALE_MAP) {
      return [LOCALE_MAP[localeCode]];
    }
  }
  return null;
}
