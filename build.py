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
    tmpFile.write(
        chrome.replace('@@THEREST@@', 
            common.replace('@@CHECK@@', 'checkStorage(false);')
        )
    )

with open('tmp/firefox/data/trimless-gmail.js', 'w') as tmpFile:
    tmpFile.write(
        firefox.replace('@@THEREST@@', 
            common.replace('    @@CHECK@@\n', '')
        )
    )

shutil.copy('chrome/background.js', 'tmp/chrome')
shutil.copy('chrome/manifest.json', 'tmp/chrome')

shutil.copy('common/jquery-2.0.3.min.js', 'tmp/chrome')
shutil.copy('common/trimless-gmail.css', 'tmp/chrome')

shutil.copy('images/icon-16.png', 'tmp/chrome')
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
shutil.copy('common/trimless-gmail.css', 'tmp/firefox/data')

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

os.system('python C:/addon-sdk/bin/cfx xpi --pkgdir=tmp/firefox')
shutil.move('trimless-gmail.xpi', 'bin/firefox.xpi')

shutil.rmtree('tmp', True)
