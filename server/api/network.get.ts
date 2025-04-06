// server/api/network.get.ts
import type { Node, Edge } from "vis-network";

export default defineEventHandler(async (event) => {
  // 定义默认数据（建议抽离到单独文件维护）
  const defNodes: Node[] = [
    { id: 1, label: "发烧" },
    { id: 2, label: "头痛" },
    { id: 3, label: "无力" },
    { id: 4, label: "咳嗽" },
    { id: 5, label: "发病时间" },
    { id: 6, label: "头痛程度" },
    { id: 7, label: "无力范围" },
    { id: 8, label: "咳嗽频率" },
    { id: 9, label: "首次发病时间" },
    { id: 10, label: "重度头痛" },
    { id: 11, label: "中度头痛" },
    { id: 12, label: "轻度头痛" },
    { id: 13, label: "全身无力" },
    { id: 14, label: "局部无力" },
    { id: 15, label: "频繁咳嗽" },
    { id: 16, label: "偶尔咳嗽" },
    { id: 17, label: "具体发病年月日" },
  ];

  const defEdges: Edge[] = [
    // 一级关联
    { id: 1, from: 1, to: 2, label: "伴随症状关联" }, // 发烧→头痛
    { id: 2, from: 1, to: 3, label: "伴随症状关联" }, // 发烧→无力
    { id: 3, from: 1, to: 4, label: "伴随症状关联" }, // 发烧→咳嗽
    { id: 4, from: 1, to: 5, label: "时间属性关联" }, // 发烧→发病时间

    // 二级特征细分
    { id: 5, from: 2, to: 6, label: "特征细分" }, // 头痛→头痛程度
    { id: 6, from: 3, to: 7, label: "特征细分" }, // 无力→无力范围
    { id: 7, from: 4, to: 8, label: "特征细分" }, // 咳嗽→咳嗽频率
    { id: 8, from: 5, to: 9, label: "时间详情" }, // 发病时间→首次发病时间

    // 三级程度细化
    { id: 9, from: 6, to: 10, label: "程度细化" }, // 头痛程度→重度头痛
    { id: 10, from: 6, to: 11, label: "程度细化" }, // 头痛程度→中度头痛
    { id: 11, from: 6, to: 12, label: "程度细化" }, // 头痛程度→轻度头痛

    // 三级范围细化
    { id: 12, from: 7, to: 13, label: "范围细化" }, // 无力范围→全身无力
    { id: 13, from: 7, to: 14, label: "范围细化" }, // 无力范围→局部无力

    // 三级频率细化
    { id: 14, from: 8, to: 15, label: "频率细化" }, // 咳嗽频率→频繁咳嗽
    { id: 15, from: 8, to: 16, label: "频率细化" }, // 咳嗽频率→偶尔咳嗽

    // 四级时间精确
    { id: 16, from: 9, to: 17, label: "时间精确" }, // 首次发病时间→具体发病年月日
  ];

  // 模拟数据库查询延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    status: 200,
    nodes: defNodes,
    edges: defEdges,
  };
});
