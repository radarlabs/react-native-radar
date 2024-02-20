"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarEventVerification = exports.RadarEventConfidence = void 0;
var RadarEventConfidence;
(function (RadarEventConfidence) {
    RadarEventConfidence[RadarEventConfidence["none"] = 0] = "none";
    RadarEventConfidence[RadarEventConfidence["low"] = 1] = "low";
    RadarEventConfidence[RadarEventConfidence["medium"] = 2] = "medium";
    RadarEventConfidence[RadarEventConfidence["high"] = 3] = "high";
})(RadarEventConfidence || (exports.RadarEventConfidence = RadarEventConfidence = {}));
var RadarEventVerification;
(function (RadarEventVerification) {
    RadarEventVerification[RadarEventVerification["accept"] = 1] = "accept";
    RadarEventVerification[RadarEventVerification["unverify"] = 0] = "unverify";
    RadarEventVerification[RadarEventVerification["reject"] = -1] = "reject";
})(RadarEventVerification || (exports.RadarEventVerification = RadarEventVerification = {}));
