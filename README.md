keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.p12 -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

android/gradle.properties
MYAPP_RELEASE_STORE_PASSWORD=******
MYAPP_RELEASE_KEY_PASSWORD=******

android/app/build.gradle
storePassword '******'
keyPassword '******'

.env
CLIENT_ID=[INSERT YOUR UID HERE]
CLIENT_SECRET=[INSERT YOUR SECRET HERE]
