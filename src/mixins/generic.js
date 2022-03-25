import { parse, format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export default {
    computed: {
        formattedDate() {
            return format(this.timestamp, "yyyy-MM-dd");
        },
    },

    methods: {
        parseDate(date) {
            return parse(
                date,
                "yyyy-MM-dd",
                utcToZonedTime(new Date(), "Asia/Makassar")
            );
        },

        parseTime(time) {
            return parse(
                time,
                "HH:mm",
                utcToZonedTime(new Date(), "Asia/Makassar")
            );
        },
    },
};
