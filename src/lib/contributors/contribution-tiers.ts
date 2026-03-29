/** Khớp ngưỡng backend `reputation.service` (hiển thị trên trang Contributors). */

export interface ContributionTierExplainer {
  code: string;
  labelVi: string;
  minPoints: number;
  maxPoints: number | null;
  description: string;
}

export const CONTRIBUTION_TIER_EXPLAINERS: ContributionTierExplainer[] = [
  {
    code: "newcomer",
    labelVi: "Mới tham gia",
    minPoints: 1,
    maxPoints: 99,
    description: "Bắt đầu hành trình đóng góp — mỗi điểm đều được ghi nhận.",
  },
  {
    code: "contributor",
    labelVi: "Đóng góp",
    minPoints: 100,
    maxPoints: 499,
    description: "Tham gia đều đặn, chia sẻ nội dung hoặc trả lời hữu ích.",
  },
  {
    code: "active",
    labelVi: "Tích cực",
    minPoints: 500,
    maxPoints: 1999,
    description: "Tác động rõ rệt tới cộng đồng qua nhiều hoạt động.",
  },
  {
    code: "notable",
    labelVi: "Nổi bật",
    minPoints: 2000,
    maxPoints: 4999,
    description: "Dẫn đầu nhóm người đóng góp theo điểm tích lũy.",
  },
  {
    code: "exceptional",
    labelVi: "Kiện xuất",
    minPoints: 5000,
    maxPoints: null,
    description: "Mức đóng góp cao nhất; hạng số trên bảng vẫn phân biệt chi tiết.",
  },
];
