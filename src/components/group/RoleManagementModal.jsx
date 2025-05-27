import React, { useState, useEffect } from "react";
import { MdClose, MdCheck } from "react-icons/md";
import { FiUsers, FiShield, FiUser } from "react-icons/fi";
import { toast } from "react-hot-toast";
import useAuthStore from "../../stores/authStore";
import useGroupStore from "../../stores/groupStore";

const RoleManagementModal = ({ isOpen, onClose, group, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user } = useAuthStore();
  const { changeRole } = useGroupStore();

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedMember(null);
      setShowRoleSelector(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Get current user's role in the group
  const currentUserMember = group?.members?.find(
    (member) =>
      (typeof member.user === "object" ? member.user._id : member.user) === user?._id
  );
  const currentUserRole = currentUserMember?.role || "member";
  const isAdmin = currentUserRole === "admin";
  const isCreator = group?.creator === user?._id;

  // Filter members based on search term
  const filteredMembers = React.useMemo(() => {
    if (!group?.members) return [];

    return group.members.filter((member) => {
      const memberName =
        typeof member.user === "object"
          ? member.user?.name || ""
          : "Thành viên";

      return memberName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [group?.members, searchTerm]);

  // Role configuration
  const roles = [
    {
      value: "admin",
      label: "Quản trị viên",
      description: "Có thể quản lý nhóm, thêm/xóa thành viên, thay đổi vai trò",
      icon: <FiShield className="text-red-500" size={18} />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      value: "moderator", 
      label: "Điều hành viên",
      description: "Có thể xóa thành viên thường, quản lý nội dung",
      icon: <FiUsers className="text-blue-500" size={18} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      value: "member",
      label: "Thành viên",
      description: "Thành viên thường của nhóm",
      icon: <FiUser className="text-gray-500" size={18} />,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    }
  ];

  // Get role display info
  const getRoleInfo = (roleValue) => {
    return roles.find(role => role.value === roleValue) || roles[2];
  };

  // Check if current user can change role of target member
  const canChangeRole = (memberRole, targetRole) => {
    if (!isAdmin) return false;
    
    // Admin can change any role except creator
    const targetMember = group?.members?.find(m => 
      (typeof m.user === "object" ? m.user._id : m.user) === 
      (typeof selectedMember?.user === "object" ? selectedMember.user._id : selectedMember.user)
    );
    
    if (!targetMember) return false;
    
    const targetUserId = typeof targetMember.user === "object" ? targetMember.user._id : targetMember.user;
    const isTargetCreator = group?.creator === targetUserId;
    
    return !isTargetCreator;
  };

  // Handle role change
  const handleRoleChange = async (newRole) => {
    if (!selectedMember || !group?._id || isProcessing) return;

    try {
      setIsProcessing(true);
      
      const memberId = typeof selectedMember.user === "object" 
        ? selectedMember.user._id 
        : selectedMember.user;
      
      const memberName = typeof selectedMember.user === "object"
        ? selectedMember.user.name
        : "Thành viên";

      await changeRole(group._id, memberId, newRole);
      
      const roleInfo = getRoleInfo(newRole);
      toast.success(`Đã thay đổi vai trò của ${memberName} thành ${roleInfo.label}`);
      
      setShowRoleSelector(false);
      setSelectedMember(null);
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error(error.message || "Không thể thay đổi vai trò");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle member selection
  const handleMemberSelect = (member) => {
    if (isProcessing) return;
    
    const memberId = typeof member.user === "object" ? member.user._id : member.user;
    const isCurrentUser = memberId === user?._id;
    const isTargetCreator = group?.creator === memberId;
    
    if (isCurrentUser) {
      toast.info("Bạn không thể thay đổi vai trò của chính mình");
      return;
    }
    
    if (isTargetCreator) {
      toast.info("Không thể thay đổi vai trò của người tạo nhóm");
      return;
    }
    
    if (!isAdmin) {
      toast.error("Chỉ quản trị viên mới có thể thay đổi vai trò");
      return;
    }
    
    setSelectedMember(member);
    setShowRoleSelector(true);
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
            <h3 className="font-medium text-lg">Phân quyền thành viên</h3>
          </div>
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm thành viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Selector */}
        {showRoleSelector && selectedMember && (
          <div className="p-4 border-b bg-gray-50">
            <div className="mb-3">
              <h4 className="font-medium text-sm text-gray-700">
                Chọn vai trò cho {typeof selectedMember.user === "object" ? selectedMember.user.name : "Thành viên"}
              </h4>
            </div>
            
            <div className="space-y-2">
              {roles.map((role) => {
                const currentRole = selectedMember.role;
                const isCurrentRole = currentRole === role.value;
                const canSelect = canChangeRole(currentRole, role.value);
                
                return (
                  <button
                    key={role.value}
                    onClick={() => !isCurrentRole && canSelect ? handleRoleChange(role.value) : null}
                    disabled={isCurrentRole || !canSelect || isProcessing}
                    className={`w-full p-3 rounded-md border text-left transition-colors ${
                      isCurrentRole 
                        ? `${role.bgColor} ${role.borderColor} ${role.color}` 
                        : canSelect && !isProcessing
                          ? "border-gray-200 hover:bg-gray-50"
                          : "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {role.icon}
                        <div className="ml-3">
                          <div className="font-medium text-sm">{role.label}</div>
                          <div className="text-xs text-gray-500">{role.description}</div>
                        </div>
                      </div>
                      {isCurrentRole && <MdCheck className="text-green-500" size={18} />}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setShowRoleSelector(false)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isProcessing}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="max-h-[400px] overflow-y-auto">
          <div className="px-4 py-3 flex items-center justify-between border-b">
            <h4 className="font-medium">
              Danh sách thành viên ({filteredMembers.length})
            </h4>
          </div>

          <div className="divide-y">
            {filteredMembers.map((member) => {
              const memberUser = typeof member.user === "object" ? member.user : null;
              const memberId = memberUser?._id || member.user;
              const memberName = memberUser?.name || "Thành viên";
              const memberAvatar = memberUser?.primary_avatar;
              const isCurrentUser = memberId === user?._id;
              const isTargetCreator = group?.creator === memberId;
              const roleInfo = getRoleInfo(member.role);

              return (
                <div
                  key={memberId}
                  className={`flex items-center justify-between p-4 ${
                    !isCurrentUser && !isTargetCreator && isAdmin && !isProcessing
                      ? "hover:bg-gray-50 cursor-pointer" 
                      : ""
                  }`}
                  onClick={() => handleMemberSelect(member)}
                >
                  <div className="flex items-center flex-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 flex-shrink-0">
                      {memberAvatar ? (
                        <img
                          src={memberAvatar}
                          alt={memberName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                          {memberName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="font-medium truncate">
                          {isCurrentUser ? "Bạn" : memberName}
                        </h3>
                        {isTargetCreator && (
                          <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                            Người tạo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className={`flex items-center px-2 py-1 rounded-md ${roleInfo.bgColor} ${roleInfo.borderColor} border`}>
                      {roleInfo.icon}
                      <span className={`ml-1 text-xs font-medium ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy thành viên nào
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-600">
            <p className="mb-1">💡 <strong>Lưu ý:</strong></p>
            <p>• Chỉ quản trị viên mới có thể thay đổi vai trò thành viên</p>
            <p>• Không thể thay đổi vai trò của người tạo nhóm</p>
            <p>• Điều hành viên chỉ có thể xóa thành viên thường</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagementModal;
