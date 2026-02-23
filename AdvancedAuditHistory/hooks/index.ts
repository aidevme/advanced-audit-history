// AdvancedAuditHistory\hooks\index.ts

/**
 * Primary data-fetching hook. Retrieves entity attribute metadata and audit history
 * records from Dataverse, falling back to mock data when running in the PCF test harness.
 */
import useDataverse from "./useDataverse";

/**
 * Navigation helper hook. Provides utilities for opening Dataverse record forms,
 * confirmation dialogs, and other platform navigation actions.
 */
import { useNavigation } from "./useNavigation";

/**
 * User information hook. Resolves the current PCF context user's display name,
 * user ID, and assigned security roles from Dataverse.
 */
import { useUserInfo } from "./useUserInfo";

/**
 * Audit operations hook. Exposes `restoreChanges` which writes old field values
 * back to the target record via the PCF WebAPI, enabling single-field and bulk restore.
 */
import { useAudit } from "./useAudit";

/**
 * Singleton service class wrapping the PCF context for low-level Dataverse HTTP fetches
 * and `Xrm.WebApi` executions used across the hook layer.
 */
import { XrmService } from "./service";

export {
  useDataverse,
  useNavigation,
  useUserInfo,
  useAudit,
  XrmService
}