import React, { useState } from "react";
import { MdClose, MdGroup, MdLink } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { toast } from "react-hot-toast";
import useGroupStore from "../../stores/groupStore";
import useAuthStore from "../../stores/authStore";

const JoinGroupModal = ({ isOpen, onClose, initialLink = "" }) => {
  const [inviteLink, setInviteLink] = useState(initialLink);
  const [groupPreview, setGroupPreview] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  
  const { joinGroupByLink, previewGroupByLink } = useGroupStore();
  const { user } = useAuthStore();

  // Hàm trích xuất invite code từ link
  const extractInviteCode = (link) => {
    if (!link) return null;
    
    // Xử lý các định dạng link khác nhau
    const patterns = [
      /\/join\/([a-f0-9]+)$/i,
      /invite[_-]?code[=:]([a-f0-9]+)/i,
      /^([a-f0-9]+)$/i, // Chỉ là mã code
    ];
    
    for (const pattern of patterns) {
      const match = link.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  // Xem trước thông tin nhóm
  const handlePreviewGroup = async () => {
    const inviteCode = extractInviteCode(inviteLink.trim());
    
    if (!inviteCode) {
      toast.error("Link tham gia không hợp lệ");
      return;
    }

    setIsPreviewLoading(true);
    try {
      const result = await previewGroupByLink(inviteCode);
      
      if (result.success) {
        setGroupPreview(result.group);
      } else {
        toast.error(result.error || "Không thể xem trước thông tin nhóm");
        setGroupPreview(null);
      }
    } catch (error) {
      toast.error("Lỗi khi xem trước nhóm");
      setGroupPreview(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Tham gia nhóm
  const handleJoinGroup = async () => {
    const inviteCode = extractInviteCode(inviteLink.trim());
    
    if (!inviteCode) {
      toast.error("Link tham gia không hợp lệ");
      return;
    }

    setIsJoining(true);
    try {
      const result = await joinGroupByLink(inviteCode);
      
      if (result.success) {
        toast.success(`Đã tham gia nhóm "${result.group.name}" thành công!`);
        onClose();
        setInviteLink("");
        setGroupPreview(null);
      } else {
        toast.error(result.error || "Không thể tham gia nhóm");
      }
    } catch (error) {
      toast.error("Lỗi khi tham gia nhóm");
    } finally {
      setIsJoining(false);
    }
  };

  // Reset khi đóng modal
  const handleClose = () => {
    setInviteLink("");
    setGroupPreview(null);
    onClose();
  };

  // Kiểm tra người dùng đã là thành viên chưa
  const isAlreadyMember = groupPreview?.members?.some(
    (member) => 
      (typeof member.user === "object" ? member.user._id : member.user) === user?._id
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-md w-full max-w-md relative">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="font-medium text-lg flex items-center">
            <MdGroup className="mr-2" size={20} />
            Tham gia nhóm
          </h3>
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={handleClose}
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Nhập link */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link tham gia nhóm
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập link hoặc mã mời..."
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePreviewGroup()}
              />
              <MdLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Nút xem trước */}
          <button
            className="w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 mb-4 disabled:opacity-50"
            onClick={handlePreviewGroup}
            disabled={!inviteLink.trim() || isPreviewLoading}
          >
            {isPreviewLoading ? "Đang kiểm tra..." : "Xem trước nhóm"}
          </button>

          {/* Thông tin nhóm xem trước */}
          {groupPreview && (
            <div className="border rounded-md p-4 mb-4 bg-gray-50">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200 flex-shrink-0">
                  {groupPreview.avatar ? (
                    <img
                      src={groupPreview.avatar}
                      alt={groupPreview.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FiUsers size={24} stroke="#9ca3af" strokeWidth={1} />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">{groupPreview.name}</h4>
                  <p className="text-sm text-gray-500">
                    {groupPreview.members?.length || 0} thành viên
                  </p>
                  {groupPreview.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {groupPreview.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Hiển thị một số thành viên */}
              {groupPreview.members && groupPreview.members.length > 0 && (
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Thành viên:</span>
                  <div className="flex -space-x-1">
                    {groupPreview.members.slice(0, 3).map((member, index) => {
                      const memberUser = typeof member.user === "object" ? member.user : null;
                      const memberAvatar = memberUser?.primary_avatar;
                      const memberName = memberUser?.name || "Thành viên";
                      
                      return (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full overflow-hidden bg-gray-300 border-2 border-white"
                          title={memberName}
                        >
                          {memberAvatar ? (
                            <img
                              src={memberAvatar}
                              alt={memberName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                              {memberName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {groupPreview.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{groupPreview.members.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Trạng thái thành viên */}
              {isAlreadyMember && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  Bạn đã là thành viên của nhóm này
                </div>
              )}
            </div>
          )}

          {/* Nút tham gia */}
          {groupPreview && !isAlreadyMember && (
            <button
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              onClick={handleJoinGroup}
              disabled={isJoining}
            >
              {isJoining ? "Đang tham gia..." : "Tham gia nhóm"}
            </button>
          )}

          {/* Hướng dẫn */}
          <div className="mt-4 text-xs text-gray-500">
            <p>• Bạn có thể nhập link đầy đủ hoặc chỉ mã mời</p>
            <p>• Link có dạng: .../join/abc123def hoặc abc123def</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupModal;
