require "json"

json = File.read(File.join(__dir__, "package.json"))
package = JSON.parse(json).deep_symbolize_keys

Pod::Spec.new do |s|
  s.name = package[:name]
  s.version = package[:version]
  s.license = { type: "Apache-2.0" }
  s.homepage = "https://github.com/radarlabs/react-native-radar"
  s.authors = package[:author] || "radarlabs"
  s.summary = package[:description]
  s.source = { git: package[:repository][:url] }
  s.source_files = "ios/*.{h,m}"
  s.platform = :ios, "10.0"

  s.dependency "React"
  s.dependency "RadarSDK", "3.0.4"
end
