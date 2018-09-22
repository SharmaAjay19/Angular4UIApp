import os
import json
import ftplib

firstDeployment = False
source = "dist"
destination = "site/wwwroot/"
config = json.load(open("appcredentials.json", "r"))

session = ftplib.FTP(config["endpoint"], config["username"], config["password"])
if firstDeployment:
	file = open("web.config", "rb")
	session.storbinary("STOR " + destination + "", file)
allFiles = [os.path.join(dp, f).replace("\\", "/") for dp, dn, filenames in os.walk(source) for f in filenames]
for f in allFiles:
	file = open(f, "rb")
	childname = str.replace(f, source+"/", "")
	session.storbinary("STOR " + destination + childname, file)
	print("Uploaded at ...  ", destination+childname)
print("Done uploading ", len(allFiles), "files")
session.quit()