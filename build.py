import os
import shutil
import zipfile

shutil.rmtree('bin', True)

os.mkdir('bin')
os.mkdir('bin/tmp')
os.mkdir('bin/tmp/chrome')
os.mkdir('bin/tmp/firefox')
os.mkdir('bin/tmp/firefox/data')
os.mkdir('bin/tmp/firefox/lib')

with open('common/trimless-gmail.js', 'r') as tmpFile:
    common = tmpFile.read()

with open('chrome/trimless-gmail.js', 'r') as tmpFile:
    chrome = tmpFile.read()

with open('firefox/trimless-gmail.js', 'r') as tmpFile:
    firefox = tmpFile.read()

with open('bin/tmp/chrome/trimless-gmail.js', 'w') as tmpFile:
    tmpFile.write(chrome.replace('@@THEREST@@', common))

with open('bin/tmp/firefox/data/trimless-gmail.js', 'w') as tmpFile:
    tmpFile.write(firefox.replace('@@THEREST@@', common))

shutil.copy('chrome/chrome-bootstrap-1.1.4.min.css', 'bin/tmp/chrome')
shutil.copy('chrome/background.js', 'bin/tmp/chrome')
shutil.copy('chrome/manifest.json', 'bin/tmp/chrome')
shutil.copy('chrome/options.html', 'bin/tmp/chrome')
shutil.copy('chrome/options.js', 'bin/tmp/chrome')
shutil.copy('chrome/spectrum-1.1.1.min.css', 'bin/tmp/chrome')
shutil.copy('chrome/spectrum-1.1.1.min.js', 'bin/tmp/chrome')

shutil.copy('common/jquery-2.1.0.min.js', 'bin/tmp/chrome')
shutil.copy('common/tinycolor-0.9.16.min.js', 'bin/tmp/chrome')

shutil.copy('images/icon-16.png', 'bin/tmp/chrome')
shutil.copy('images/icon-32.png', 'bin/tmp/chrome')
shutil.copy('images/icon-48.png', 'bin/tmp/chrome')
shutil.copy('images/icon-128.png', 'bin/tmp/chrome')
shutil.copy('images/icon-action-19.png', 'bin/tmp/chrome')
shutil.copy('images/icon-action-38.png', 'bin/tmp/chrome')
shutil.copy('images/icon-action-gray-19.png', 'bin/tmp/chrome')
shutil.copy('images/icon-action-gray-38.png', 'bin/tmp/chrome')

shutil.copy('firefox/main.css', 'bin/tmp/firefox/data')
shutil.copy('firefox/main.js', 'bin/tmp/firefox/lib')
shutil.copy('firefox/package.json', 'bin/tmp/firefox')

shutil.copy('common/jquery-2.1.0.min.js', 'bin/tmp/firefox/data')
shutil.copy('common/tinycolor-0.9.16.min.js', 'bin/tmp/firefox/data')

shutil.copy('images/icon-48.png', 'bin/tmp/firefox/data')
shutil.copy('images/icon-64.png', 'bin/tmp/firefox/data')
shutil.copy('images/icon-action-19.png', 'bin/tmp/firefox/data')
shutil.copy('images/icon-action-gray-19.png', 'bin/tmp/firefox/data')

os.chdir('bin/tmp/chrome')

with zipfile.ZipFile('../../chrome.zip', 'w') as tmpZip:
    for root, dirs, files in os.walk('.'):
        for tmpFile in files:
            tmpZip.write(os.path.join(root, tmpFile))

os.chdir('..')

os.system('C:/Python27/python C:/addon-sdk-1.15/bin/cfx xpi --pkgdir=firefox')
shutil.move('trimless-gmail.xpi', '../firefox.xpi')
