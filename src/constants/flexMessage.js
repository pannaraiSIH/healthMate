const confirmFlexMessage = ({ username, illnesses, bookedDate }) => {
  return {
    type: "carousel",
    contents: [
      {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "HealthMate",
              color: "#1DB446",
              size: "sm",
              weight: "bold",
            },
            {
              type: "text",
              text: "ยืนยันการใช้สิทธิบัตรทอง",
              wrap: true,
              weight: "bold",
              size: "xl",
              margin: "md",
            },
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "ชื่อผู้ใช้สิทธิ",
                      wrap: true,
                      color: "#555555",
                    },
                    {
                      type: "text",
                      text: username,
                      color: "#111111",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "อาการ",
                      color: "#555555",
                    },
                    {
                      type: "text",
                      text: illnesses || "ข้อมูลอาการไม่ได้ระบุ",
                      wrap: true,
                      color: "#111111",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "วันที่",
                      color: "#555555",
                    },
                    {
                      type: "text",
                      text: bookedDate,
                      wrap: true,
                      color: "#111111",
                    },
                  ],
                },
              ],
              spacing: "sm",
              margin: "xxl",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "primary",
              action: {
                type: "message",
                label: "ยืนยัน",
                text: "ยืนยันการใช้สิทธิบัตรทอง",
              },
            },
            {
              type: "button",
              action: {
                type: "message",
                label: "ยกเลิก",
                text: "ยกเลิกการใช้สิทธิบัตรทอง",
              },
              style: "link",
            },
          ],
        },
      },
    ],
  };
};

const detailFlexMessage = ({ username, illnesses, bookedDate, bookingId }) => {
  return {
    type: "carousel",
    contents: [
      {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "HealthMate",
              size: "sm",
              weight: "bold",
              color: "#1DB446",
            },
            {
              type: "text",
              text: "รายละเอียดการใช้สิทธิ\nบัตรทอง",
              weight: "bold",
              size: "xl",
              margin: "md",
              wrap: true,
            },
            {
              type: "separator",
              margin: "xxl",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "xxl",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "ชื่อผู้ใช้",
                      color: "#555555",
                    },
                    {
                      type: "text",
                      text: username,
                      color: "#111111",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "อาการ",
                      color: "#555555",
                    },
                    {
                      type: "text",
                      text: illnesses || "ข้อมูลอาการไม่ได้ระบุ",
                      wrap: true,
                      color: "#111111",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "วันที่จอง",
                      color: "#555555",
                    },
                    {
                      type: "text",
                      text: bookedDate,
                      wrap: true,
                      color: "#111111",
                    },
                  ],
                },
              ],
            },
            {
              type: "separator",
              margin: "xxl",
            },
            {
              type: "box",
              layout: "horizontal",
              margin: "md",
              contents: [
                {
                  type: "text",
                  text: "BOOKING ID",
                  size: "xs",
                  color: "#aaaaaa",
                },
                {
                  type: "text",
                  text: `#${bookingId}`,
                  color: "#aaaaaa",
                  size: "xs",
                },
              ],
            },
          ],
        },
        styles: {
          footer: {
            separator: true,
          },
        },
      },
    ],
  };
};

const ucsHistoryRows = (data) => {
  const rows = data.map((item) => {
    let statusText = "-";

    switch (item.status) {
      case "P":
        statusText = "กำลังดำเนินการ";
        break;
      case "C":
        statusText = "กำลังดำเนินการ";
        break;
      case "D":
        statusText = "กำลังดำเนินการ";
        break;
      default:
        break;
    }

    return {
      type: "box",
      layout: "vertical",
      margin: "xxl",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "Booking Id",
              color: "#555555",
            },
            {
              type: "text",
              text: `#${item.id}`,
              color: "#111111",
            },
          ],
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "อาการ",
              color: "#555555",
            },
            {
              type: "text",
              text: item.symptom || "ข้อมูลอาการไม่ได้ระบุ",
              color: "#111111",
              wrap: true,
            },
          ],
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "สถานะ",
              color: "#555555",
            },
            {
              type: "text",
              text: statusText,
              color: "#111111",
            },
          ],
        },
      ],
    };
  });

  return rows;
};

const ucsHistoryFlexMessage = (rows) => {
  return {
    type: "carousel",
    contents: [
      {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "HealthMate",
              weight: "bold",
              color: "#1DB446",
              size: "sm",
            },
            {
              type: "text",
              text: "ประวัติการใช้สิทธิบัตรทอง",
              weight: "bold",
              size: "xl",
              margin: "md",
              wrap: true,
            },
            {
              type: "separator",
              margin: "xxl",
            },
            ...rows,
            {
              type: "separator",
              margin: "xxl",
            },
            {
              type: "box",
              layout: "horizontal",
              margin: "md",
              contents: [
                {
                  type: "text",
                  text: "จำนวนทั้งหมด",
                  size: "xs",
                  color: "#aaaaaa",
                },
                {
                  type: "text",
                  text: `${rows.length} ครั้ง`,
                  color: "#aaaaaa",
                  size: "xs",
                },
              ],
            },
          ],
        },
        styles: {
          footer: {
            separator: true,
          },
        },
      },
    ],
  };
};

module.exports = {
  confirmFlexMessage,
  detailFlexMessage,
  ucsHistoryFlexMessage,
  ucsHistoryRows,
};
