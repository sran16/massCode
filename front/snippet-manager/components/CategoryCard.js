export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  props: {
    category: {
      id: String,
      name: String,
    },
    active: Boolean,
  },
  template: `
    <div
      class="bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-lg px-3 py-2 flex flex-col gap-4"
      :class="{ 'bg-gray-200': this.active }"
    >
      <div>{{ category.name }}</div>
    </div>
  `,
};
