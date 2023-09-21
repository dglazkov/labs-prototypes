/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Board } from "@google-labs/breadboard";
import { Starter } from "@google-labs/llm-starter";
import { Nursery } from "@google-labs/node-nursery";

const board = new Board({
  title: "Retrieval-augmented generation with Pinecone",
  description:
    "This board implements the simples possible retrieval-augmented generation system using Pinecone store. The store was generated with [pinecone-load](https://github.com/google/labs-prototypes/blob/main/seeds/graph-playground/graphs/pinecone-load.json).",
  version: "0.0.1",
});
const starter = board.addKit(Starter);
const nursery = board.addKit(Nursery);

const headers = starter
  .jsonata(
    '{ "Api-Key": $, "Accept": "application/json", "Content-Type": "application/json" }',
    { $id: "make-headers" }
  )
  .wire("json<-PINECONE_API_KEY", starter.secrets(["PINECONE_API_KEY"]));

const apiCall = starter
  .fetch(false, {
    $id: "pinecone-query-api",
    method: "POST",
  })
  .wire("headers<-result", headers)
  .wire(
    "url<-prompt",
    starter
      .promptTemplate("{{PINECONE_URL}}/query", {
        $id: "make-pinecone-url",
      })
      .wire("<-PINECONE_URL", starter.secrets(["PINECONE_URL"]))
  );

const body = starter.jsonata(
  '{ "vector": $, "topK": 10, "includeMetadata": true }',
  {
    $id: "make-body",
  }
);

const template =
  starter.promptTemplate(`Analyze the question and the knowledge base, provided below.
  
If the knowledge base does not contain the information to produce the answer, tell the user that you don't know.

Otherwise, write a comprehensive answer to the question using only the information from the knowledge base.

# Question:

{{query}}

# Knowledge Base:
{{context}}

# Answer
`);

board
  .input({ $id: "query" })
  .wire(
    "text->",
    nursery
      .embedString()
      .wire("<-PALM_KEY", starter.secrets(["PALM_KEY"]))
      .wire(
        "embedding->json",
        body.wire(
          "result->body",
          apiCall.wire(
            "response->json",
            starter
              .jsonata("$join(matches.metadata.text, '\n\n')")
              .wire("result->context", template)
          )
        )
      )
  )
  .wire("text->query", template);

template.wire(
  "prompt->text",
  starter
    .generateText()
    .wire("<-PALM_KEY", starter.secrets(["PALM_KEY"]))
    .wire("completion->text", board.output({ $id: "rag" }))
);

export default board;