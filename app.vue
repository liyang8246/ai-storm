<script setup lang="ts">
// 导入 vue-vis-network 组件和相关类型
import { VueVisNetwork } from "vue-vis-network2";
import type { Edge, Node, Options } from "vis-network";
// 导入应用数据存储
import { useMyAppDataStore } from "@/stores/appData";

// 初始化应用数据存储
const myAppDataStore = useMyAppDataStore();

// 定义网络图的引用
const networkRef = ref();

// 定义默认的节点和边
const defNodes: Node[] = [
  { id: 1, label: "Node 1" },
  { id: 2, label: "Node 2" },
  { id: 3, label: "Node 3" },
  { id: 4, label: "Node 4" },
  { id: 5, label: "Node 5" },
];
const defEdges: Edge[] = [
  { id: 1, from: 1, to: 3 },
  { id: 2, from: 1, to: 2 },
  { id: 3, from: 2, to: 4 },
  { id: 4, from: 2, to: 5 },
];

// 定义网络图的数据和配置
const network = ref<{
  nodes: Node[];
  edges: Edge[];
  options: Options;
}>({
  nodes: [...defNodes],
  edges: [...defEdges],
  options: {
    nodes: {
      shape: "circle",
      size: 24,
      color: {
        border: "grey",
        highlight: {
          border: "black",
          background: "white",
        },
        hover: {
          border: "orange",
          background: "grey",
        },
      },
      font: { color: "black" },
      shapeProperties: {
        useBorderWithImage: true,
      },
    },
  },
});

// 处理网络图事件
const networkEvent = (...args: any[]) => {
  if (args[0] === "click") {
    console.log(args[1].nodes[0]);
    myAppDataStore.selectedNode = args[1].nodes[0];
  }
  if (args[0] === "nodes-add") {
    console.log(args[0]);
  }
  if (args[0] === "selectNode") {
    console.log(args[0]);
    // myAppDataStore.isHiddenNav = false;
  }
  if (args[0] === "deselectNode") {
    console.log(args[0]);
    // myAppDataStore.isHiddenNav = true;
  }
};

// 添加节点
const addNode = () => {
  if (myAppDataStore.selectedNode) {
    network.value.nodes.push({
      id:
        (network.value.nodes[network.value.nodes.length - 1].id as number) + 1,
      label:
        "node " +
        ((network.value.nodes[network.value.nodes.length - 1].id as number) +
          1),
    });
    const n1 = myAppDataStore.selectedNode;
    const n2 = network.value.nodes[network.value.nodes.length - 1].id as number;
    network.value.edges.push({
      id:
        (network.value.edges[network.value.edges.length - 1].id as number) + 1,
      from: n1,
      to: n2,
    });
  } else {
    alert("Please select a node first");
  }
};

// 切换合并节点的显示状态
const combineNode = () => {
  myAppDataStore.isHiddenCombineNav = !myAppDataStore.isHiddenCombineNav;
};

// 移除节点
const removeNode = (selectedNodeId: number | null) => {
  if (selectedNodeId) {
    network.value.nodes.reduce((acc, node) => {
      if (node.id === selectedNodeId) {
        network.value.nodes.splice(acc, 1);
        network.value.edges = network.value.edges.filter((edge) => {
          return edge.from !== selectedNodeId && edge.to !== selectedNodeId;
        });
      }
      return acc + 1;
    }, 0);
  } else {
    alert("Please select a node first");
  }
};

// 重置网络图
const resetNetwork = () => {
  network.value = {
    nodes: [...defNodes],
    edges: [...defEdges],
    options: {},
  };
};

// 输入值的引用
const selectedNode1 = ref(null);
const selectedNode2 = ref(null);

// 合并节点
const Combine = () => {
  // 验证选择有效性
  if (!selectedNode1.value || !selectedNode2.value) {
    alert("Please select two nodes first");
    return;
  }

  if (selectedNode1.value === selectedNode2.value) {
    alert("Please select two different nodes");
    return;
  }
  console.log(selectedNode1.value, selectedNode2.value);

  // 获取选择的节点对象
  const n1 = network.value.nodes.find((n) => n.id === selectedNode1.value);
  const n2 = network.value.nodes.find((n) => n.id === selectedNode2.value);

  console.log(n1, n2);
  if (n1 && n2) {
    network.value.nodes.push({
      id:
        (network.value.nodes[network.value.nodes.length - 1].id as number) + 1,
      label:
        "node " +
        ((network.value.nodes[network.value.nodes.length - 1].id as number) +
          1),
    });
    const n3 = network.value.nodes[network.value.nodes.length - 1].id as number;
    network.value.edges.push({
      id:
        (network.value.edges[network.value.edges.length - 1].id as number) + 1,
      from: n1.id,
      to: n3,
    });
    network.value.edges.push({
      id:
        (network.value.edges[network.value.edges.length - 1].id as number) + 1,
      from: n2.id,
      to: n3,
    });
    myAppDataStore.isHiddenCombineNav = true;
    selectedNode1.value = null;
    selectedNode2.value = null;
  }
};

// 组件挂载后执行
onMounted(() => {
  const network = networkRef.value.network;
  // if you want access to vis.js network api
  console.log(network);
  // getNode(id) to get node
  console.log("getNode-1: ", networkRef.value.getNode(1));
  // getEdge(id) to get edge
  console.log("getEdge-1: ", networkRef.value.getEdge(1));
});
</script>

<template>
  <!-- 主要的模板代码 -->
  <div class="w-screen h-screen relative">
    <vue-vis-network
      ref="networkRef"
      class="w-full bg-white h-full"
      :nodes="network.nodes"
      :edges="network.edges"
      :options="network.options"
      @click="networkEvent('click', $event)"
      @nodes-add="networkEvent('nodes-add', $event)"
      @select-node="networkEvent('selectNode', $event)"
      @deselect-node="networkEvent('deselectNode', $event)"
    >
    </vue-vis-network>
    <aside class="absolute top-10 left-10 z-10 isolate">
      <!-- 主导航 -->
      <nav
        class="nav flex flex-col bg-blue-100/80 backdrop-blur-sm rounded-xl shadow-lg p-4 space-y-2 w-48 transition-all duration-200 border border-blue-200/50 hover:shadow-xl hover:bg-blue-100/90"
      >
        <!-- Add Node 按钮 -->
        <button
          @click="addNode"
          class="flex items-center px-4 py-2 text-sm font-medium text-blue-900 bg-white/50 hover:bg-blue-200/30 rounded-lg transition-all duration-200 border border-blue-200/50 hover:border-blue-300 hover:text-blue-700 shadow-sm"
        >
          <svg
            class="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Node
        </button>

        <!-- Combine Node 按钮 -->
        <button
          @click="combineNode()"
          class="font-sans px-4 py-2 text-sm font-medium text-blue-900 bg-white/50 hover:bg-blue-200/30 rounded-lg border border-blue-200/50 hover:border-blue-300 transition-colors duration-200 shadow-sm"
        >
          Combine Node
        </button>

        <!-- Remove Node 按钮 -->
        <button
          @click="removeNode(myAppDataStore.selectedNode)"
          class="px-4 py-2 text-sm font-medium text-blue-900 bg-white/50 hover:bg-blue-200/30 rounded-lg border border-blue-200/50 hover:border-blue-300 transition-colors duration-200 shadow-sm"
        >
          Remove Node
        </button>

        <!-- 分割线 -->
        <div class="border-t border-blue-200/50 my-2"></div>

        <!-- Reset 按钮 -->
        <button
          @click="resetNetwork"
          class="px-4 py-2 text-sm font-medium text-red-700 bg-white/50 hover:bg-red-100/30 rounded-lg border border-red-200/50 hover:border-red-300 transition-colors duration-200 shadow-sm"
        >
          Reset
        </button>
      </nav>

      <!-- Combine 面板 -->
      <div
        class="flex flex-col gap-2 mt-4 px-4 py-3 bg-blue-100/80 backdrop-blur-sm rounded-xl border border-blue-200/50 shadow-lg transition-all duration-200"
        :hidden="myAppDataStore.isHiddenCombineNav"
      >
        <header class=" font-sans mr-2 text-gl font-bold text-blue-900">Combine</header>

        <!-- Node1 选择 -->
        <div class="w-full space-y-1">
          <label class="text-xs font-bold text-blue-700/90">Node1:</label>
          <select
            name="node1"
            class="w-full px-2 py-1 text-sm  bg-white/50 rounded-md border border-blue-200/70 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            v-model="selectedNode1"
          >
            <option disabled :value="null" class="text-blue-900/80">
              选择节点1
            </option>
            <option
              v-for="(node, index) in network.nodes"
              :key="index"
              :value="node.id"
              class="text-blue-900"
            >
              {{ node.label }}
            </option>
          </select>
        </div>

        <!-- Node2 选择 -->
        <div class="w-full space-y-1">
          <label class="text-xs font-bold text-blue-700/90">Node2:</label>
          <select
            name="node1"
            class="w-full px-2 py-1 text-sm bg-white/50 rounded-md border border-blue-200/70 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            v-model="selectedNode2"
          >
            <option disabled :value="null" class="text-blue-900/80">
              选择节点2
            </option>
            <option
              v-for="(node, index) in network.nodes"
              :key="index"
              :value="node.id"
              class="text-blue-900"
            >
              {{ node.label }}
            </option>
          </select>
        </div>

        <!-- Combine 按钮 -->
        <button
          class="mt-2 px-3 py-1.5 text-sm font-medium text-blue-900 bg-white/50 hover:bg-blue-200/30 rounded-md border border-blue-200/50 hover:border-blue-300 transition-colors duration-200 shadow-sm"
          @click="Combine()"
        >
          Combine
        </button>
      </div>
    </aside>
  </div>
</template>

<style></style>
