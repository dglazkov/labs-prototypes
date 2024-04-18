/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SECTION {
  TEAM_LIST = "team-list",
  TEAM_JOB = "team-job",
}

export interface State {
  teamId: string | null;
  teamSection: number | null;
  section: SECTION | null;
}

export enum Participant {
  USER = "user",
  TEAM_MEMBER = "team-member",
}

export enum ItemFormat {
  TEXT,
  MARKDOWN,
  MULTIPART,
}

export enum ItemType {
  TEXT_CONVERSATION = "text-conversation",
  DATA = "data",
  INPUT = "input",
  PENDING = "pending",
  MULTIPART = "multipart",
}

export enum ItemStatus {
  INERT = "inert",
  ACTIVE = "active",
  COMPLETE = "complete",
}

export type ConversationInputPart =
  | string
  | {
      inline_data: { mime_type: string; data: string };
      url: string;
      name: string;
    };

export interface ConversationPending {
  datetime: Date;
  type: ItemType.PENDING;
  who: Participant;
  role?: string;
}

export interface ConversationText {
  datetime: Date;
  type: ItemType.TEXT_CONVERSATION;
  who: Participant;
  role?: string;
  format: ItemFormat;
  message: string | string[];
}

export interface ConversationData {
  datetime: Date;
  type: ItemType.DATA;
  who: Participant;
  role?: string;
  format: ItemFormat;
  message: string | string[];
}

export interface ConversationInput {
  datetime: Date;
  type: ItemType.INPUT;
  role?: string;
  format: ItemFormat;
  title: string;
  parts: ConversationInputPart[];
}

export interface ConversationMultipart {
  datetime: Date;
  type: ItemType.MULTIPART;
  who: Participant;
  role?: string;
  parts: ConversationInputPart[];
}

export type ConversationItem =
  | ConversationText
  | ConversationData
  | ConversationInput
  | ConversationPending
  | ConversationMultipart;

export interface ActivityItem {
  datetime: Date;
  who: Participant;
  role?: string;
  headline: string;
  content?: string | string[];
  subItems?: ActivityItem[];
  active: boolean;
  format?: ItemFormat;
}

export interface AssetItem {
  datetime: Date;
  who: Participant;
  role?: string;
  name: string;
  mime_type: string;
  url: string;
}

export interface TeamListItem {
  datetime: Date;
  teamName: string;
  description?: string | string[];
  format?: ItemFormat;
  status: ItemStatus;
  statusDescription?: string;
  who: Participant;
  role?: string;
  graph?: string;
}