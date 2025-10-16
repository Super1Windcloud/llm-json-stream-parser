import { tryParseJsonStreamAutoComplete } from "./index.js";
import { mockJsonStreamToCallback } from "./mock.js";

let content = "";
mockJsonStreamToCallback((chunk: string) => {
	content += chunk;
    tryParseJsonStreamAutoComplete(content, (obj) => {
        console.log("解析到完整 JSON对象:", JSON.stringify(obj ));
    });
});
