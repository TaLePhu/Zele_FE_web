import React, { useState, useEffect } from "react";
import { MdClose, MdCheck } from "react-icons/md";
import { FiSettings, FiMessageSquare, FiUserPlus, FiShare2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import useAuthStore from "../../stores/authStore";
import useGroupStore from "../../stores/groupStore";

const GroupSettingsModal = ({ isOpen, onClose, group, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    who_can_send_messages: "all",
    who_can_add_members: "admins",
    who_can_share_invite_link: "all"
  });

  const { user } = useAuthStore();
  const { updateGroup } = useGroupStore();

  // Get current user's role in the group
  const currentUserMember = group?.members?.find(
    (member) =>
      (typeof member.user === "object" ? member.user._id : member.user) === user?._id
  );
  const currentUserRole = currentUserMember?.role || "member";
  const isAdmin = currentUserRole === "admin";

  // Initialize settings from group data
  useEffect(() => {
    if (group?.settings) {
      setSettings({
        who_can_send_messages: group.settings.who_can_send_messages || "all",
        who_can_add_members: group.settings.who_can_add_members || "admins",
        who_can_share_invite_link: group.settings.who_can_share_invite_link || "all"
      });
    }
  }, [group]);

  // Permission options
  const permissionOptions = [
    {
      value: "all",
      label: "Tất cả thành viên",
      description: "Mọi thành viên trong nhóm"
    },
    {
      value: "admins_moderators", 
      label: "Quản trị viên và Điều hành viên",
      description: "Chỉ admin và moderator"
    },
    {
      value: "admins",
      label: "Chỉ Quản trị viên",
      description: "Chỉ admin mới có quyền"
    }
  ];

  // Settings configuration
  const settingsConfig = [
    {
      key: "who_can_send_messages",
      title: "Ai có thể gửi tin nhắn",
      description: "Quyền gửi tin nhắn trong nhóm",
      icon: <FiMessageSquare className="text-blue-500" size={20} />
    },
    {
      key: "who_can_add_members",
      title: "Ai có thể thêm thành viên",
      description: "Quyền thêm thành viên mới vào nhóm",
      icon: <FiUserPlus className="text-green-500" size={20} />
    },
    {
      key: "who_can_share_invite_link",
      title: "Ai có thể chia sẻ link mời",
      description: "Quyền chia sẻ link tham gia nhóm",
      icon: <FiShare2 className="text-purple-500" size={20} />
    }
  ];

  // Handle setting change
  const handleSettingChange = (settingKey, value) => {
    if (!isAdmin) {
      toast.error("Chỉ quản trị viên mới có thể thay đổi cài đặt");
      return;
    }

    setSettings(prev => ({
      ...prev,
      [settingKey]: value
    }));
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    if (!isAdmin) {
      toast.error("Chỉ quản trị viên mới có thể lưu cài đặt");
      return;
    }

    if (!group?._id || isProcessing) return;

    try {
      setIsProcessing(true);

      await updateGroup(group._id, { settings }, false);
      
      toast.success("Đã cập nhật cài đặt nhóm");
      onBack();
    } catch (error) {
      console.error("Error updating group settings:", error);
      toast.error(error.message || "Không thể cập nhật cài đặt");
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if settings have changed
  const hasChanges = () => {
    if (!group?.settings) return true;
    
    return (
      settings.who_can_send_messages !== (group.settings.who_can_send_messages || "all") ||
      settings.who_can_add_members !== (group.settings.who_can_add_members || "admins") ||
      settings.who_can_share_invite_link !== (group.settings.who_can_share_invite_link || "all")
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
          <div className="flex items-center">
            <button
              className="p-1 rounded-full hover:bg-gray-100 mr-2"
              onClick={onBack}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h3 className="font-medium text-lg">Cài đặt nhóm</h3>
          </div>
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Non-admin notice */}
        {!isAdmin && (
          <div className="p-4 bg-yellow-50 border-b">
            <div className="flex items-center">
              <FiSettings className="text-yellow-600 mr-2" size={16} />
              <span className="text-sm text-yellow-700">
                Chỉ quản trị viên mới có thể thay đổi cài đặt nhóm
              </span>
            </div>
          </div>
        )}

        {/* Settings List */}
        <div className="p-4 space-y-6">
          {settingsConfig.map((config) => (
            <div key={config.key} className="space-y-3">
              <div className="flex items-center">
                {config.icon}
                <div className="ml-3">
                  <h4 className="font-medium text-sm">{config.title}</h4>
                  <p className="text-xs text-gray-500">{config.description}</p>
                </div>
              </div>

              <div className="space-y-2 ml-8">
                {permissionOptions.map((option) => {
                  const isSelected = settings[config.key] === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSettingChange(config.key, option.value)}
                      disabled={!isAdmin || isProcessing}
                      className={`w-full p-3 rounded-md border text-left transition-colors ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : isAdmin && !isProcessing
                            ? "border-gray-200 hover:bg-gray-50"
                            : "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                        {isSelected && <MdCheck className="text-blue-600" size={18} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {isAdmin && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-end gap-3">
              <button
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isProcessing}
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={!hasChanges() || isProcessing}
                className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                  !hasChanges() || isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isProcessing ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-600">
            <p className="mb-1">💡 <strong>Thông tin:</strong></p>
            <p>• Cài đặt áp dụng cho tất cả thành viên trong nhóm</p>
            <p>• Quản trị viên luôn có đầy đủ quyền hạn</p>
            <p>• Thay đổi cài đặt sẽ có hiệu lực ngay lập tức</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
