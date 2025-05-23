require "json"

json = File.read(File.join(__dir__, "package.json"))
package = JSON.parse(json).deep_symbolize_keys

new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'
fabric_enabled = ENV['RCT_FABRIC_ENABLED'] 

Pod::Spec.new do |s|
  s.name = package[:name]
  s.version = package[:version]
  s.license = { type: "Apache-2.0" }
  s.homepage = "https://github.com/radarlabs/react-native-radar"
  s.authors = package[:author] || "radarlabs"
  s.summary = package[:description]
  s.source = { git: package[:repository][:url] }
  s.source_files = "ios/*.{h,m,mm}"
  s.platform = :ios, "11.0"

  # Install dependencies
  install_modules_dependencies(s)

  # Dependencies
  s.dependency "RadarSDK", "~> 3.21.3"

  # New Architecture support
  if new_arch_enabled
    s.compiler_flags = "-DRCT_NEW_ARCH_ENABLED=1"
    s.pod_target_xcconfig = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "OTHER_CPLUSPLUSFLAGS" => "-DRCT_NEW_ARCH_ENABLED=1"
    }
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  end

  # Legacy support
  unless new_arch_enabled
    s.dependency "React-Core"
  end
end
