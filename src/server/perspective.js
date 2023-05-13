const axios = require('axios');


const PERSPECTIVE_API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

async function analyzeText(text) {
  try {
    const response = await axios.post(
      PERSPECTIVE_API_URL,
      {
        comment: { text },
        requestedAttributes: { TOXICITY: {} , IDENTITY_ATTACK: {}, INSULT: {}, THREAT: {} },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        params: {
          key: "AIzaSyCaHjRbD99EWrHOT5E60bV2bvWIQtlBL3k",
        },
      }
    );

    console.log(JSON.stringify(response.data, null, 2));
    console.log((attrs.filter((attr) => attr.summaryScore.value > 0.7).length > 0))
  } catch (error) {
    console.error('Error analyzing text:', error);
  }
}
