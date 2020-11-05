import { parse } from "date-fns";

export default {
  methods: {
    parseTime(time) {
      return parse(time, "HH:mm", new Date());
    }
  }
};
