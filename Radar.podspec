require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "Radar"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/radarlabs/react-native-radar"
  s.license      = package["license"]
  s.authors      = "radarlabs"

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/radarlabs/react-native-radar.git/react-native-radar.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,cpp}"
  s.private_header_files = "ios/**/*.h"
  s.dependency "RadarSDK", "3.23.1"

 install_modules_dependencies(s)
end
