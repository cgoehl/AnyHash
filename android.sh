#!/bin/sh
apk="platforms/android/ant-build/AnyHash-debug.apk"
phonegap local build android && adb install -r $apk
