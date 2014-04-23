import json
import os
import shutil
import zipfile

shutil.rmtree('bin', True)

bt = 'bin/tmp'
btc = bt + '/chrome'
btf = bt + '/firefox'
btfd = btf + '/data'
btfl = btf + '/lib'

os.makedirs(btc)
os.makedirs(btfd)
os.mkdir(btfl)

with open('common/common.json', 'r') as tmpFile:
    commonJson = json.load(tmpFile)

with open('chrome/manifest.json', 'r') as tmpIn, open(btc + '/manifest.json', 'w') as tmpOut:
    tmpJson = json.load(tmpIn)
    tmpJson['name'] = commonJson['name']
    tmpJson['short_name'] = commonJson['short_name']
    tmpJson['description'] = commonJson['description']
    tmpJson['version'] = commonJson['version']
    json.dump(tmpJson, tmpOut, ensure_ascii=False)

with open('firefox/package.json', 'r') as tmpIn, open(btf + '/package.json', 'w') as tmpOut:
    tmpJson = json.load(tmpIn)
    tmpJson['fullName'] = commonJson['name']
    tmpJson['name'] = commonJson['short_name'].replace(' ', '-').lower()
    tmpJson['description'] = commonJson['description']
    tmpJson['version'] = commonJson['version']
    json.dump(tmpJson, tmpOut, ensure_ascii=False)

with open('common/trimless-gmail.js', 'r') as tmpFile:
    common = tmpFile.read()

with open('chrome/trimless-gmail.js', 'r') as tmpIn, open(btc + '/trimless-gmail.js', 'w') as tmpOut:
    tmpOut.write(tmpIn.read().replace('@@THEREST@@', common))

with open('firefox/trimless-gmail.js', 'r') as tmpIn, open(btfd + '/trimless-gmail.js', 'w') as tmpOut:
    tmpOut.write(tmpIn.read().replace('@@THEREST@@', common))

def copychrome(what):
    shutil.copy(what, btc)

def copydata(what, chrome=True):
    shutil.copy(what, btfd)
    if chrome:
        copychrome(what)

def copylib(what):
    shutil.copy(what, btfl)

copydata('common/jquery-2.1.0.min.js')
copydata('common/tinycolor-0.9.17.js')
copydata('images/icon-48.png')
copydata('images/icon-action-19.png')
copydata('images/icon-action-gray-19.png')

copychrome('chrome/background.js')
copychrome('chrome/chrome-bootstrap-1.2.1.css')
copychrome('chrome/options.html')
copychrome('chrome/options.js')
copychrome('chrome/spectrum-1.3.4.css')
copychrome('chrome/spectrum-1.3.4.js')
copychrome('images/icon-128.png')
copychrome('images/icon-16.png')
copychrome('images/icon-32.png')
copychrome('images/icon-action-38.png')
copychrome('images/icon-action-gray-38.png')

copydata('firefox/main.css', False)
copydata('images/icon-64.png', False)
copylib('firefox/main.js')

os.chdir(btc)

with zipfile.ZipFile('../../chrome.zip', 'w') as tmpZip:
    for root, dirs, files in os.walk('.'):
        for tmpFile in files:
            tmpZip.write(os.path.join(root, tmpFile))

os.chdir('..')

os.system('CALL "%PYTHON2%" "%CFX%" xpi --pkgdir=firefox')
shutil.move('trimless-gmail.xpi', '../firefox.xpi')
