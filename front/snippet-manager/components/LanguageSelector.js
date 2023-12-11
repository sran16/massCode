export default {
  data() {
    return {
      selected: null,
      languages: ["js", "html", "css"],
    };
  },
  props: {
    language: String,
  },
  mounted() {
    this.selected = this.language;
  },
  emits: ["update"],
  template: `
    <div>
      <select
        v-model="selected"
        @change="$emit('update', selected)"
      >
        <option
          v-for="language in languages"
          :key="language"
          :value="language"
        >
          {{ language }}
        </option>
      </select>
    </div>
  `,
};
