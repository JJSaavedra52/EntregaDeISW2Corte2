import mongoose from 'mongoose';

export const startConnection = async () => {
  const url = encodeURI('mongodb+srv://juanjose:claseISW2@isw2.2yyqkah.mongodb.net/?retryWrites=true&w=majority');
  await mongoose.connect(url);
};

export default startConnection;
