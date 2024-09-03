export const APPROVALS_FILTER = {
    received: "WCMApprovalProcessSegments/any(seg: seg/SegmentInactive eq '')",
    pending: "WCMApprovalProcessSegments/all(seg: seg/SegmentInactive ne '')", // there isn't any active processSegment (==approve)
};

export default function ApprovalsQueryOptions(type) {
    const baseQueryOptions = '$expand=WCMApprovalProcessSegments,WCMApprovalProcessLongtexts,WCMApplications,WCMDocumentHeaders&$orderby=Counter';
    const filter = APPROVALS_FILTER[type] || '';

    return `${baseQueryOptions}${filter ? '&$filter=' + filter : ''}`;
}
