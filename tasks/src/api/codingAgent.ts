import { showToast, Toast } from "@raycast/api";
import { getConfig } from "../utils/config";

/**
 * Send a task to the coding agent endpoint
 */
export async function sendToCodingAgent(taskId: number): Promise<boolean> {
  try {
    const config = await getConfig();
    if (!config) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Configuration Missing",
        message: "Please configure endpoints first",
      });
      return false;
    }

    const response = await fetch(config.CODING_AGENT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await showToast({
      style: Toast.Style.Success,
      title: "Task Sent to Coding Agent",
      message: `Task #${taskId} has been sent successfully`,
    });

    return true;
  } catch (error) {
    console.error("Error sending task to coding agent:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to Send Task",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
    return false;
  }
}
