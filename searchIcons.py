import requests
import shutil
import os
from PIL import Image

def downloadImages(url, iconName):
    response = requests.get(url)
    image = response.content
    fileName = iconName + '.png'
    folderPath = './Images/'
    filePath = os.path.join(folderPath, fileName)
    
    with open(filePath, 'wb') as file:
        file.write(image)
    
    img = Image.open(filePath)
    imgResize = img.resize((256,256), Image.LANCZOS)
    imgResize.save(filePath)

def makeUnitypackageFile(fullPath):
    avatars_dir = os.path.join(os.getcwd(), 'Avaters')
    unityPackageFile = os.path.basename(fullPath)
    movedFolderPath = os.path.join(avatars_dir, unityPackageFile)
    shutil.move(fullPath, movedFolderPath)
    return movedFolderPath

def settingFolderIcon(filePath, fileName, fullPath, movedFolderPath):
    folderPath = './Avaters/' + os.path.basename(fullPath)
    img =Image.open(filePath)
    icoFileName = fileName + '.ico'
    icoFile = os.path.join(folderPath, icoFileName)
    img.save(icoFile)
    
    desktopIniPath = os.path.join(movedFolderPath, 'desktop.ini')
    with open(desktopIniPath, 'w') as f:
        f.write(f'[.ShellClassInfo]\nIconResource="{icoFileName}",0\n')
    
    os.system(f'attrib +h {desktopIniPath}')
    os.system(f'attrib +s {movedFolderPath}')