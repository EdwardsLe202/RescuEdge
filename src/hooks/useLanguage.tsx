"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "vi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    recordings: "Recordings",
    alerts: "Alerts",
    sendUnits: "Send Units",
    searchPlaceholder: "Search 'color', 'vehicle', 'people', 'objects'...",
    sendingUnitsTitle: "Sending Units",
    dispatchSubtitle: "Disaster Dispatch Coordination Center",
    whichUnitToSend: "Which unit to send?",
    police: "Police",
    fire: "Fire",
    rescue: "Rescue",
    typeOfIncident: "Type of Incident",
    whatIsProblem: "What is the problem?",
    howMuchVictims: "How much victims?",
    howMuchAggressors: "How much aggressors?",
    rateDangerLevel: "Rate the danger level",
    backToDetails: "Back to Details",
    sendUnitsBtn: "Send Units",
    mapTip: "💡 Tip: Click anywhere on the satellite map to select target coordinates.",
    nasaAlertsTitle: "NASA EONET Real-Time Alerts",
    noOne: "No one",
    single: "Single",
    onTheLine: "On the line with #39",
    loadingNasa: "Loading NASA Live Feed...",
    refreshedNasa: "NASA Feed Refreshed!",
    zoomingToAlert: "Zooming to NASA Alert:",
    dispatchedSuccess: "Dispatched successfully",
    selectedPoint: "Selected dispatch point at",
    flooding: "Flooding",
    landslide: "Landslide / Rockfall",
    severeTyphoon: "Severe Typhoon / Storm",
    wildfire: "Wildfire Alert",
    medicalEmergency: "Medical Emergency",
    otherDisaster: "Other Disaster Response",
    dangerLow: "Low / Safe",
    dangerBelowAvg: "Below Average",
    dangerModerate: "Moderate Risk",
    dangerHigh: "High Alert",
    dangerVeryHigh: "Very High / Severe",
    dangerCritical: "Critical / Extreme Danger",
    // Dashboard and General Translations
    cameraFeed: "Camera Feed",
    status: "Status",
    lastSeen: "Last Seen",
    totalIncidents: "Total Incidents",
    activeDevices: "Active Devices",
    lastIncident: "Last Incident",
    loadingMetrics: "Loading metrics...",
    cameraSettings: "Camera System Settings",
    liveStreamStatus: "Live Stream Status",
    confidenceThreshold: "Detection Confidence Threshold",
    deviceOperationalSettings: "Device Operational Settings",
    liveStreamMode: "Live Stream Mode",
    cameraState: "Camera State",
    offlineMode: "Offline Mode",
    activeNodeMode: "Active Node Mode",
    thresholdValue: "Threshold Value",
    aiAlertsFeed: "Real-Time AI Alerts Feed",
    liveStreamDetectedDesc: "Live stream of detected events and surveillance metrics.",
    loadingAlerts: "Loading alerts...",
    noAlertsForDevice: "No alerts for this device",
    confidence: "Confidence",
    commentsTitle: "Security Audit & Incident Log",
    writeNotePlaceholder: "Write a security note...",
    postNote: "Post Note",
    // Recordings
    securityEventRecordings: "Security Event Recordings",
    galleryDesc: "Gallery of recorded incident snapshots captured by AI nodes.",
    loadingGallery: "Loading Recordings Gallery...",
    noRecordedEvents: "No recorded events found",
    aiIncident: "AI Incident",
    viewLiveFeed: "View Live Feed",
    // Alerts History
    alertsHistoryTitle: "AI Incident Alerts History",
    alertsHistoryDesc: "Comprehensive audit logs and historical analysis of security violations.",
    totalDetections: "Total Detections",
    highRiskAlerts: "High Risk (>90% Conf.)",
    camerasAffected: "Unique Cameras Affected",
    searchByCameraId: "Search by Camera ID...",
    minConfidence: "Min Confidence",
    loadingAlertsHistory: "Loading Alerts History...",
    snapshotCol: "Snapshot",
    timestampCol: "Timestamp",
    cameraIdCol: "Camera ID",
    confidenceCol: "Confidence",
    distanceCol: "Distance",
    inferenceCol: "Inference",
    actionCol: "Action",
    monitorBtn: "Monitor",
    // Sidebar Added
    allDevices: "All Devices",
    noDevicesOnline: "No devices online",
    settings: "Settings",
    signOut: "Sign Out",
    // Video Player Added
    initializingPlayer: "Initializing Player...",
    noLiveSignal: "No Live Stream Signal",
    offlineDesc: "This camera device is currently offline or does not have an active live S3 video stream feed.",
    activateSimulation: "Activate Simulation Feed",
    statusInactive: "STATUS: INACTIVE",
    feedNull: "FEED: NULL",
    playbackSimulation: "PLAYBACK SIMULATION",
    liveStreamActive: "LIVE STREAM ACTIVE",
    deviceConfigTitle: "Device Configuration (AWS IoT Shadow State)",
    operationMode: "Operation Mode",
    cameraSensor: "Camera Sensor",
    aiAlertThreshold: "AI Alert Threshold",
    sensorEnabled: "🟢 Enabled",
    sensorDisabled: "🔴 Disabled",
    liveMode: "Live",
    offlineModeLabel: "Offline",
    // Comments Sidebar Added
    commentsLogs: "Comments logs",
    collapseSidebar: "Collapse sidebar",
    commentPlaceholder: "Share details or tag officer...",
    forensicRole: "Sub Admin Dept. of Forensic",
    investigationRole: "Sub Admin Dept. of Investigation",
    commentContent1: "Issue is set to be resolved. Evidence files extracted successfully.",
    commentContent2: "There has been a suspect in the past backside of the store near Malviya road.",
    commentContent3: "@AbhaySalvi move forward, proceed to tag this location for standard patrols.",
    commentTime1: "Nov 22 01:40 PM",
    commentTime2: "Today at 02:10 PM",
    commentTime3: "Today at 02:10 PM",
    // Alerts Feed Added
    loadingAlertsFeed: "Loading Alerts Feed...",
    realtimeAlertsFeed: "Real-time Alerts Feed",
    noIncidentsDetected: "No incidents detected for this device",
    incidentDetected: "Incident detected",
    deviceIdLabel: "Device ID",
    // Timeline Flow Added
    timelineTitle: "AI EVENT SEGMENTS TIMELINE FLOW",
    // Sending Units / Dispatch Added
    categoryLabel: "Category",
    coordinatesLabel: "Coordinates",
    nasaAlert: "NASA Alert",
    loadBtn: "Load",
    refreshNasaFeed: "Refresh NASA Feed",
    describeIncident: "Describe the incident details...",
    nasaError: "Could not fetch real-time NASA alerts. Using simulated local points.",
  },
  vi: {
    dashboard: "Bảng điều khiển",
    recordings: "Bản ghi hình",
    alerts: "Cảnh báo",
    sendUnits: "Gửi Lực Lượng Cứu Hộ",
    searchPlaceholder: "Tìm kiếm 'màu sắc', 'phương tiện', 'người', 'vật thể'...",
    sendingUnitsTitle: "Gửi Lực Lượng Cứu Hộ",
    dispatchSubtitle: "Trung tâm Điều phối Ứng phó Thiên tai",
    whichUnitToSend: "Chọn lực lượng hỗ trợ?",
    police: "Cảnh sát",
    fire: "Phòng cháy",
    rescue: "Cứu hộ",
    typeOfIncident: "Loại hình sự cố / thiên tai",
    whatIsProblem: "Chi tiết sự cố / sự việc?",
    howMuchVictims: "Số lượng nạn nhân?",
    howMuchAggressors: "Số lượng đối tượng nguy hiểm?",
    rateDangerLevel: "Đánh giá mức độ nguy hiểm",
    backToDetails: "Quay lại Chi tiết",
    sendUnitsBtn: "Gửi Lực Lượng Cứu Hộ",
    mapTip: "💡 Gợi ý: Bấm vào bất kỳ đâu trên bản đồ vệ tinh để chọn tọa độ mục tiêu.",
    nasaAlertsTitle: "Cảnh báo thời gian thực từ NASA EONET",
    noOne: "Không có",
    single: "Một người",
    onTheLine: "Đang kết nối cuộc gọi #39",
    loadingNasa: "Đang tải dữ liệu NASA...",
    refreshedNasa: "Đã cập nhật dữ liệu NASA!",
    zoomingToAlert: "Phóng to cảnh báo NASA:",
    dispatchedSuccess: "Đã gửi lực lượng hỗ trợ thành công",
    selectedPoint: "Đã chọn điểm cứu hộ tại tọa độ",
    flooding: "Lũ lụt / Ngập úng",
    landslide: "Sạt lở đất / Đá lở",
    severeTyphoon: "Bão lớn / Giông lốc",
    wildfire: "Cảnh báo cháy rừng",
    medicalEmergency: "Cấp cứu y tế",
    otherDisaster: "Phản ứng thiên tai khác",
    dangerLow: "Thấp / An toàn",
    dangerBelowAvg: "Dưới trung bình",
    dangerModerate: "Nguy cơ trung bình",
    dangerHigh: "Cảnh báo cao",
    dangerVeryHigh: "Rất cao / Nghiêm trọng",
    dangerCritical: "Nguy kịch / Cực kỳ nguy hiểm",
    // Dashboard and General Translations
    cameraFeed: "Nguồn Camera",
    status: "Trạng thái",
    lastSeen: "Lần cuối thấy",
    totalIncidents: "Tổng số sự cố",
    activeDevices: "Thiết bị hoạt động",
    lastIncident: "Sự cố gần nhất",
    loadingMetrics: "Đang tải chỉ số...",
    cameraSettings: "Thiết lập hệ thống camera",
    liveStreamStatus: "Trạng thái truyền phát trực tiếp",
    confidenceThreshold: "Ngưỡng độ tin cậy phát hiện",
    deviceOperationalSettings: "Cài đặt vận hành thiết bị",
    liveStreamMode: "Chế độ phát trực tiếp",
    cameraState: "Trạng thái camera",
    offlineMode: "Chế độ ngoại tuyến",
    activeNodeMode: "Chế độ node hoạt động",
    thresholdValue: "Giá trị ngưỡng",
    aiAlertsFeed: "Luồng cảnh báo AI thời gian thực",
    liveStreamDetectedDesc: "Luồng truyền phát trực tiếp các sự kiện phát hiện và các số đo giám sát.",
    loadingAlerts: "Đang tải cảnh báo...",
    noAlertsForDevice: "Không có cảnh báo cho thiết bị này",
    confidence: "Độ tin cậy",
    commentsTitle: "Nhật ký Sự cố & Kiểm toán Bảo mật",
    writeNotePlaceholder: "Viết ghi chú bảo mật...",
    postNote: "Đăng Ghi Chú",
    // Recordings
    securityEventRecordings: "Bản ghi hình sự cố bảo mật",
    galleryDesc: "Thư viện ảnh chụp sự cố ghi lại bởi AI.",
    loadingGallery: "Đang tải thư viện ghi hình...",
    noRecordedEvents: "Không tìm thấy sự việc nào được ghi lại",
    aiIncident: "Sự cố AI",
    viewLiveFeed: "Xem Trực Tiếp",
    // Alerts History
    alertsHistoryTitle: "Lịch sử Cảnh báo Sự cố AI",
    alertsHistoryDesc: "Nhật ký kiểm toán chi tiết và phân tích dữ liệu lịch sử các vi phạm bảo mật.",
    totalDetections: "Tổng số phát hiện",
    highRiskAlerts: "Nguy cơ cao (>90% Conf.)",
    camerasAffected: "Số camera bị ảnh hưởng",
    searchByCameraId: "Tìm kiếm theo mã camera...",
    minConfidence: "Độ tin cậy tối thiểu",
    loadingAlertsHistory: "Đang tải lịch sử cảnh báo...",
    snapshotCol: "Ảnh chụp",
    timestampCol: "Thời gian",
    cameraIdCol: "Mã Camera",
    confidenceCol: "Độ tin cậy",
    distanceCol: "Khoảng cách",
    inferenceCol: "Thời gian xử lý",
    actionCol: "Hành động",
    monitorBtn: "Giám sát",
    // Sidebar Added
    allDevices: "Tất cả thiết bị",
    noDevicesOnline: "Không có thiết bị trực tuyến",
    settings: "Cài đặt",
    signOut: "Đăng xuất",
    // Video Player Added
    initializingPlayer: "Đang khởi tạo trình phát...",
    noLiveSignal: "Không có tín hiệu truyền phát trực tiếp",
    offlineDesc: "Thiết bị camera này hiện đang ngoại tuyến hoặc không có nguồn truyền phát video trực tiếp S3.",
    activateSimulation: "Kích hoạt nguồn giả lập",
    statusInactive: "TRẠNG THÁI: NGOẠI TUYẾN",
    feedNull: "NGUỒN TRUYỀN: TRỐNG",
    playbackSimulation: "PHÁT LẠI GIẢ LẬP",
    liveStreamActive: "NGUỒN TRỰC TIẾP HOẠT ĐỘNG",
    deviceConfigTitle: "Cấu hình thiết bị (Trạng thái AWS IoT Shadow)",
    operationMode: "Chế độ vận hành",
    cameraSensor: "Cảm biến camera",
    aiAlertThreshold: "Ngưỡng cảnh báo AI",
    sensorEnabled: "🟢 Đang bật",
    sensorDisabled: "🔴 Đang tắt",
    liveMode: "Trực tiếp",
    offlineModeLabel: "Ngoại tuyến",
    // Comments Sidebar Added
    commentsLogs: "Nhật ký bình luận",
    collapseSidebar: "Thu gọn thanh bên",
    commentPlaceholder: "Chia sẻ chi tiết hoặc gắn thẻ nhân viên...",
    forensicRole: "Phó Quản trị viên Phòng Pháp y",
    investigationRole: "Phó Quản trị viên Phòng Điều tra",
    commentContent1: "Sự cố được thiết lập để giải quyết. Các tệp bằng chứng đã được trích xuất thành công.",
    commentContent2: "Đã có một nghi phạm xuất hiện ở phía sau cửa hàng gần đường Malviya trước đây.",
    commentContent3: "@AbhaySalvi tiến lên phía trước, tiến hành đánh dấu vị trí này để tuần tra tiêu chuẩn.",
    commentTime1: "22 thg 11 lúc 13:40",
    commentTime2: "Hôm nay lúc 14:10",
    commentTime3: "Hôm nay lúc 14:10",
    // Alerts Feed Added
    loadingAlertsFeed: "Đang tải luồng cảnh báo...",
    realtimeAlertsFeed: "Luồng cảnh báo thời gian thực",
    noIncidentsDetected: "Không phát hiện sự cố nào trên thiết bị này",
    incidentDetected: "Phát hiện sự cố",
    deviceIdLabel: "Mã thiết bị",
    // Timeline Flow Added
    timelineTitle: "DÒNG THỜI GIAN PHÂN ĐOẠN SỰ KIỆN AI",
    // Sending Units / Dispatch Added
    categoryLabel: "Phân loại",
    coordinatesLabel: "Tọa độ",
    nasaAlert: "Cảnh báo NASA",
    loadBtn: "Xem",
    refreshNasaFeed: "Cập nhật dữ liệu NASA",
    describeIncident: "Mô tả chi tiết sự cố...",
    nasaError: "Không thể tải cảnh báo thời gian thực từ NASA. Đang sử dụng các điểm giả lập địa phương.",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>("en");

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("app-language") as Language;
    if (savedLanguage === "en" || savedLanguage === "vi") {
      setLang(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLang(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
