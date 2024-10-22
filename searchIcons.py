import requests
from bs4 import BeautifulSoup
# from PIL import Image
# import shutil
import os

def downloadImages(url, iconName):
    #movedFolderPath = makeUnitypackageFile(fullPath)
    
    response = requests.get(url)
    image = response.content
    fileName = iconName + '.jpg'
    folderPath = './Images/'
    filePath = os.path.join(folderPath, fileName)
    
    with open(filePath, 'wb') as file:
        file.write(image)
    
    # settingFolderIcon(filePath, fileName, fullPath, movedFolderPath)

def SearchIcons(url, iconName):
    # movedFolderPath = makeUnitypackageFile(fullPath)
    
    fileName = iconName + '.jpg'
    response = requests.get(url)
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    folderPath = './Images/'
    
    imageElements= soup.find('img', class_='market-item-detail-item-image')
    
    responseImage = requests.get(imageElements['src'])
    image = responseImage.content
    filePath = os.path.join(folderPath, fileName)
    
    with open(filePath, 'wb') as file:
        file.write(image)
    
    # settingFolderIcon(filePath, fileName, fullPath, movedFolderPath)
"""
def makeUnitypackageFile(fullPath):
    avatars_dir = os.path.join(os.getcwd(), 'Avaters')
    if not os.path.isdir('Avaters'):
        os.mkdir('Avaters')
    unityPackageFile = os.path.basename(fullPath)
    movedFolderPath = os.path.join(avatars_dir, unityPackageFile)
    shutil.move(fullPath, movedFolderPath)
    return movedFolderPath
"""

"""
def settingFolderIcon(filePath, fileName, fullPath, movedFolderPath):
    folderPath = './Avaters/' + os.path.basename(fullPath)
    img =Image.open(filePath)
    new_size = 256, 256
    img.thumbnail(new_size)
    icoFileName = os.path.splitext(fileName)[0] + '.ico'
    icoFile = os.path.join(folderPath, icoFileName)
    img.save(icoFile, format='ICO')
    os.remove(filePath)
    
    desktopIniPath = os.path.join(movedFolderPath, 'desktop.ini')
    with open(desktopIniPath, 'w') as f:
        f.write(f'[.ShellClassInfo]\nIconResource="{icoFileName}",0\n')
    
    os.system(f'attrib +h {desktopIniPath}')
    os.system(f'attrib +s {movedFolderPath}')
    
    print("フォルダーのアイコンを変更しました。")
"""