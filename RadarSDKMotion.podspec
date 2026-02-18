require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RadarSDKMotion"
  s.version      = package["version"]
  s.summary      = "RadarSDKMotion extension for react-native-radar"
  s.homepage     = "https://github.com/radarlabs/react-native-radar"
  s.license      = package["license"]
  s.authors      = "radarlabs"

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/radarlabs/react-native-radar.git", :tag => "#{s.version}" }

  s.source_files = "ios/RadarSDKMotionStub.swift"

  s.vendored_frameworks = "ios/RadarSDKMotion.xcframework"

  s.dependency "Radar", "#{s.version}"

  install_modules_dependencies(s)
end