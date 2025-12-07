import BaseModal from "@/Components/Modals/Base/BaseModal";
import Button from "@/Components/Buttons/Button";

export default function PendingModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title=''
            maxWidth='md'
        >
            <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Account Pending Approval
                </h2>
                <p className="text-gray-600 mb-6">
                    Your farmer account has been submitted and is awaiting administrator approval.
                </p>
                <Button variant="secondary" fullWidth onClick={onClose}>
                    OK
                </Button>
            </div>
        </BaseModal>
    );
}