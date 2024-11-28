const dateFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "long",
  year: "numeric",
  calendar: "buddhist",
});

module.exports = dateFormatter;
