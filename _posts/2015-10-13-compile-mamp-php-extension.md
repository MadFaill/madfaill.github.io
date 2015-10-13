---
title:  "Сборка расширений PHP для MAMP"
description: "Just compile me..."
category: tutorial
tags: [tutorial]
resource: "http://verysimple.com/2013/11/05/compile-php-extensions-for-mamp/"
---

Compiling a PHP extension (shared object / module) from source for [MAMP][1] requires a bit of special configuration.  If you follow the standard instructions to phpize, configure and make the .so file then you’ll most likely end up with a module that’s incompatible with MAMP due to the fact that it is compiled for whichever version of PHP is pre-installed with OSX.  For example OSX 10.9 Mavericks includes PHP 5.4, while the latest version of MAMP is running PHP 5.5.  Following the default compile instructions will result in a PHP 5.4 binary.


**1. Install System Requirements**

Before you start make sure that both XCode and [Homebrew][2] and autoconf are all installed. Once Homebrew is installed autoconf can be installed with the command:

```
brew install autoconf
```

2. Download and copy appropriate PHP source code

MAMP doesn’t include any PHP source code which is needed when compiling PHP extensions.  PHP Source files are provided on the [MAMP Downloads][3] page and are are referred to as “MAMP Components.” You can optionally download source directly from the [PHP Releases][4] page, making sure you locate the source files that exactly match your installed version of PHP.  Once you have the source files,  unzip them and rename the folder to “php”   Copy this folder to the appropriate MAMP includes directory.  For PHP 5.5.3 that would be:

```
/Applications/MAMP/bin/php/php5.5.3/includes/php
```

Once the source code is in this folder, run the following configure command to generate all of the necessary header files.  Note that –with-php-config argument includes a path to the php-config binary for the specific version you are using with MAMP.  (MAMP does include these binaries by default)

```
cd /Applications/MAMP/bin/php/php5.5.3/includes/php
./configure --with-php-config=/Applications/MAMP/bin/php/php5.5.3/bin/php-config
```

You may see some warnings, however as long as all of the header files are generated you should still be able to compile extensions.

**3. Compile Your Custom PHP Extension**

Your machine should now be ready to compile PHP extensions.  At this point you should follow the normal compilation instructions, except you must explicitly specify the path to phpize and you will provide the –with-php-config argument to the configure command.  For PHP 5.5.3, it would look something like this:

```
cd /path/to/your/module/source
/Applications/MAMP/bin/php/php5.5.3/bin/phpize
./configure --with-php-config=/Applications/MAMP/bin/php/php5.5.3/bin/php-config
make
```

 **4. Install Extension for use with MAMP**

You should at this point have a mymodulename.so file that’s ready to install.  You can move this file to the appropriate subfolder of MAMP.  Using PHP 5.5.3 as an example again, this is located in:

```
/Applications/MAMP/bin/php/php5.5.3/lib/php/extensions/no-debug-non-zts-20121212/
```

Once the .so file is there, you can add the appropriate line in php.ini to enable the extension.  For PHP 5.5.3 the .ini file is located at: /Applications/MAMP/bin/php/php5.5.3/conf/php.ini 

```
extension=mymodulename.so
```

Save php.ini, restart MAMP and browse to phpinfo.php to verify your extension is installed.

**5. Troubleshooting**

If your extension doesn’t load, check `/Applications/MAMP/logs/php_error.log` for information


[1]: http://www.mamp.info/
[2]: http://brew.sh/
[3]: http://www.mamp.info/en/downloads/
[4]: http://www.php.net/releases/

