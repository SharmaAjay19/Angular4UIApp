import os
import ftplib

firstDeployment = False
source = "dist"
destination = "site/wwwroot/"
config = {
	"endpoint" : "waws-prod-sn1-089.ftp.azurewebsites.windows.net",
	"username" : "angular4uiapp\\$angular4uiapp",
	"password" : "8eY15plaAdM6n5mvmwWdDDJZ2KKDscM0XjkCvSafHrzYAbuu7zCBdcvZvRnK"
}

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