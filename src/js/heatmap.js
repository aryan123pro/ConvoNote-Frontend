// heatmap.js

export function mapConfidenceToEmojis(confidenceArray) {
    return confidenceArray.map(entry => {
      let emoji = '🧊';
      if (entry.confidence > 0.85) emoji = '🔥';
      else if (entry.confidence > 0.6) emoji = '🟡';
  
      return {
        emoji,
        timestamp: entry.timestamp,
        text: entry.text
      };
    });
  }
  