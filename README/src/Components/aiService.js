import { Client } from "@gradio/client";

export const predictReaction = async (reactants, conditions) => {
  try {

    const client = await Client.connect("nadamomen26/simu.api");

    const result = await client.predict("/predict_api", {
      reactants: reactants,
      conditions: conditions,
    });

    return result.data;

  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};