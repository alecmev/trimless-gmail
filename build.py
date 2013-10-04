import os
import shutil
import zipfile

shutil.rmtree('bin', True)
shutil.rmtree('tmp', True)

os.mkdir('bin')
os.mkdir('tmp')
os.mkdir('tmp/chrome')
os.mkdir('tmp/firefox')
os.mkdir('tmp/firefox/data')
os.mkdir('tmp/firefox/lib')

with open('common/trimless-gmail.js', 'r') as tmpFile:
    common = tmpFile.read()

with open('chrome/trimless-gmail.js', 'r') as tmpFile:
    chrome = tmpFile.read()

with open('firefox/trimless-gmail.js', 'r') as tmpFile:
    firefox = tmpFile.read()

with open('tmp/chrome/trimless-gmail.js', 'w') as tmpFile:
    tmpFile.write(chrome.replace('@@THEREST@@', common))

with open('tmp/firefox/data/trimless-gmail.js', 'w') as tmpFile:
    tmpFile.write(firefox.replace('@@THEREST@@', common))

shutil.copy('chrome/chrome-bootstrap-1.1.4.min.css', 'tmp/chrome')
shutil.copy('chrome/background.js', 'tmp/chrome')
shutil.copy('chrome/manifest.json', 'tmp/chrome')
shutil.copy('chrome/options.html', 'tmp/chrome')
shutil.copy('chrome/options.js', 'tmp/chrome')
shutil.copy('chrome/spectrum-1.1.1.min.css', 'tmp/chrome')
shutil.copy('chrome/spectrum-1.1.1.min.js', 'tmp/chrome')

shutil.copy('common/jquery-2.0.3.min.js', 'tmp/chrome')
shutil.copy('common/tinycolor-0.9.16.min.js', 'tmp/chrome')

shutil.copy('images/icon-16.png', 'tmp/chrome')
shutil.copy('images/icon-32.png', 'tmp/chrome')
shutil.copy('images/icon-48.png', 'tmp/chrome')
shutil.copy('images/icon-128.png', 'tmp/chrome')
shutil.copy('images/icon-action-19.png', 'tmp/chrome')
shutil.copy('images/icon-action-38.png', 'tmp/chrome')
shutil.copy('images/icon-action-gray-19.png', 'tmp/chrome')
shutil.copy('images/icon-action-gray-38.png', 'tmp/chrome')

shutil.copy('firefox/main.css', 'tmp/firefox/data')
shutil.copy('firefox/main.js', 'tmp/firefox/lib')
shutil.copy('firefox/package.json', 'tmp/firefox')

shutil.copy('common/jquery-2.0.3.min.js', 'tmp/firefox/data')
shutil.copy('common/tinycolor-0.9.16.min.js', 'tmp/firefox/data')

shutil.copy('images/icon-48.png', 'tmp/firefox/data')
shutil.copy('images/icon-64.png', 'tmp/firefox/data')
shutil.copy('images/icon-action-19.png', 'tmp/firefox/data')
shutil.copy('images/icon-action-gray-19.png', 'tmp/firefox/data')

os.chdir('tmp/chrome')

with zipfile.ZipFile('../../bin/chrome.zip', 'w') as tmpZip:
    for root, dirs, files in os.walk('.'):
        for tmpFile in files:
            tmpZip.write(os.path.join(root, tmpFile))

os.chdir('../..')

os.system('C:/Python27/python D:/addon-sdk-1.14/bin/cfx xpi --pkgdir=tmp/firefox')
shutil.move('trimless-gmail.xpi', 'bin/firefox.xpi')

# shutil.rmtree('tmp', True)
