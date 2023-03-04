import Database from "./database.js";
import openai from "./openai.js";

const database = new Database();
database.initialize();

const MODEL = "gpt-3.5-turbo-0301"

const createChatCompletion = async (conversation, userId, model = MODEL) => {
  try {
    const completion = await openai.createChatCompletion({
      model,
      messages: conversation,
      user: userId,
    });
    const response = completion.data.choices[0].message;
    return response;
  } catch (e) {
    console.log(e)
    return e;
  }
};

const getResponseMessage = async (userId, message) => {
  await database.addMessage(userId, message, "user");
  const conversation = await database.getMessages(userId);
  const response = await createChatCompletion(conversation, userId);

  if(response) {
    await database.addMessage(userId, response?.content, response?.role);
  }

  return response?.content;
};

export default getResponseMessage;
