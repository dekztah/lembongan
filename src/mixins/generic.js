import { parse, format } from "date-fns";

export default {
  computed: {
    formattedDate() {
      return format(this.timestamp, "yyyy-MM-dd");
    }
  },

  methods: {
    parseDate(date) {
      return parse(date, "yyyy-MM-dd", new Date());
    },

    parseTime(time) {
      return parse(time, "HH:mm", new Date());
    }
  }
};
