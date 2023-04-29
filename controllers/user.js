const MESSAGE = require("../models/gpt");

const createGpt = async (req, res) => {
  const openAi = req.app.get("gpt");
  const { message, messages } = req.body;
  let dbData;

  try {
    dbData = await MESSAGE.find({ userId: req.userData.id });
  } catch (err) {
    console.log(err);
  }

  let assistantData = dbData.map((item) => ({
    role: "assistant",
    content: `${item.gpt}`,
  }));

  openAi
    .createChatCompletion({
      model: "gpt-3.5-turbo",

      messages: [
        {
          role: "system",
          content:
            "You are DoctorGPT and you are a physician chatbot. You will provide any medical concerns information to the patient and you will remeber patient personal information if they want to know their personal information in future you will tell them",
        },
        ...assistantData,
        ...messages,
        {
          role: "user",
          content: message,
        },
      ],
    })
    .then((ress) => {
      //console.log(res.data.choices[0].message.content);
      res.status(200).json({ result: ress.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

const createMessage = async (req, res) => {
  let message;

  try {
    message = await MESSAGE.create(req.body);
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ result: message });
};

const getMessage = async (req, res) => {
  let message;

  try {
    message = await MESSAGE.find({ userId: req.body.userId });
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ result: message });
};

module.exports = {
  createGpt,
  createMessage,
  getMessage,
};
