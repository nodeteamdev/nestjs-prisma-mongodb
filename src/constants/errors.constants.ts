export const NOT_FOUND = '404000: Not found';
export const USER_NOT_FOUND = '404001: User not found';
export const GROUP_NOT_FOUND = '404002: Group not found';
export const SESSION_NOT_FOUND = '404003: Session not found';
export const EMAIL_NOT_FOUND = '404004: Email not found';
export const API_KEY_NOT_FOUND = '404005: API key not found';
export const APPROVED_SUBNET_NOT_FOUND = '404006: Approved subnet not found';
export const AUDIT_LOG_NOT_FOUND = '404007: Audit log not found';
export const DOMAIN_NOT_FOUND = '404008: Domain not found';
export const MEMBERSHIP_NOT_FOUND = '404009: Membership not found';
export const BILLING_NOT_FOUND = '404010: Billing not found';
export const CUSTOMER_NOT_FOUND = '404011: Customer not found';
export const INVOICE_NOT_FOUND = '404012: Invoice not found';
export const SUBSCRIPTION_NOT_FOUND = '404013: Subscription not found';
export const SOURCE_NOT_FOUND = '404014: Source not found';
export const WEBHOOK_NOT_FOUND = '404015: Webhook not found';
export const TEAM_NOT_FOUND = '404016: Team not found';
export const ORGANIZATION_NOT_FOUND = '404017: Organization not found';
export const ROLE_NOT_FOUND = '404018: Role not found';
export const SEND_EMAIL_ERROR = '404019: Send email error';
export const FILE_CONVERTER_NOT_FOUND = '404020: File converter not found';
export const CHILD_NOT_FOUND = '404021: Child account not found';
export const INVITE_NOT_FOUND = '404022: Invite not found';
export const ATHLETE_NOT_FOUND = '404023: Athlete not found';
export const ROSTER_NOT_FOUND = '404024: Roster not found';
export const POSITION_NOT_FOUND = '404025: Position not found';
export const TOURNAMENT_EVENT_NOT_FOUND = '404026: Tournament event not found';
export const TEMPLATE_NOT_FOUND = '404027: Template not found';
export const AVATAR_NOT_FOUND = '404028: Avatar not found';
export const PHOTO_NOT_FOUND = '404029: Photo not found';
export const REGION_NOT_FOUND = '404030: Region not found';
export const PERMISSIONS_NOT_FOUND = '404031: Permissions not found';
export const INVITE_IS_INVALID = '404032: Invite is invalid';

export const UNAUTHORIZED_RESOURCE = '401000: Unauthorized resource';
export const INVALID_CREDENTIALS = '401001: Invalid credentials';
export const INVALID_MFA_CODE = '401002: Invalid one-time code';
export const INVALID_TOKEN = '401003: Invalid token';
export const UNVERIFIED_EMAIL = '401004: Email is not verified';
export const UNVERIFIED_LOCATION = '401005: Location is not verified';
export const MFA_BACKUP_CODE_USED = '401007: Backup code is already used';
export const INVALID_FCM_TOKEN = '401008: Invalid FCM token';
export const TOKEN_IS_EXPIRED = '401009: Token is expired';

export const FORBIDDEN_RESOURCE = '403000: Forbidden resource';

export const BAD_REQUEST = '400000: Bad request';
export const NO_TOKEN_PROVIDED = '400001: No token provided';
export const DOMAIN_NOT_VERIFIED = '400002: Domain not verified';
export const MFA_PHONE_NOT_FOUND = '400003: Phone number not found';
export const MFA_PHONE_OR_TOKEN_REQUIRED =
  '400004: Phone number or token is required';
export const MFA_NOT_ENABLED =
  '400005: Multi-factor authentication is not enabled';
export const NO_EMAILS = '400006: User has no email attached to it';
export const CURRENT_PASSWORD_REQUIRED = '400007: Current password is required';
export const COMPROMISED_PASSWORD =
  '400008: This password has been compromised in a data breach.';
export const CANNOT_DELETE_SOLE_MEMBER =
  '400009: Cannot remove the only member';
export const CANNOT_DELETE_SOLE_OWNER = '400010: Cannot remove the only owner';
export const ORDER_BY_ASC_DESC = '400011: Invalid sorting order';
export const ORDER_BY_FORMAT = '400012: Invalid ordering format';
export const WHERE_PIPE_FORMAT = '400013: Invalid query format';
export const OPTIONAL_INT_PIPE_NUMBER = '400014: $key should be a number';
export const CURSOR_PIPE_FORMAT = '400015: Invalid cursor format';
export const EMAIL_DELETE_PRIMARY = '400016: Cannot delete primary email';
export const CANNOT_UPDATE_ROLE_SOLE_OWNER =
  '400017: Cannot change the role of the only owner';
export const INVALID_DOMAIN = '400018: Invalid domain';
export const SELECT_INCLUDE_PIPE_FORMAT = '400019: Invalid query format';
export const FILE_TOO_LARGE = '400022: Uploaded file is too large';
export const PRISMA_API_ERROR = '400023: Prismic API error';
export const INVALID_VERIFICATION_CODE = '400024: Invalid verification code';
export const AUTH_CREDENTIALS_INVALID =
  '400025: Authentication credentials were missing or incorrect';
export const PHONE_OR_EMAIL_IS_REQUIRED = '400026: Phone or email is required';
export const USER_CANT_BE_GUARDIAN = "400027: User can't be guardian";
export const GUARDIAN_LIMIT_REACHED = '400028: Guardian limit reached';
export const ORGANIZATION_TYPE_TOURNAMENT =
  '400029: Organization type should be tournament';
export const ORGANIZATION_NOT_VERIFIED = '400030: Organization is not verified';
export const USER_NOT_VERIFIED = '400031: User is not verified';
export const GAME_STATUS_INCOMPATIBLE = '400032: Game status is incompatible';

export const CONFLICT = '409000: Conflict';
export const USER_CONFLICT =
  '409001: User with this email or phone already exists';
export const PHONE_VERIFIED_CONFLICT = '409002: This phone is already verified';
export const BILLING_ACCOUNT_CREATED_CONFLICT =
  '409003: Billing account is already created';
export const MFA_ENABLED_CONFLICT =
  '409004: Multi-factor authentication is already enabled';
export const MERGE_USER_CONFLICT = '409005: Cannot merge the same user';
export const UPDATE_PROFILE_CONFLICT =
  '409006: User email or phone is not verified';
export const EMAIL_VERIFIED_CONFLICT = '409007: This email is already verified';
export const TRANSACTION_ERROR = '409009: Transaction Error';
export const INVALID_USER = '409010: Invalid User';
export const INVITATION_ALREADY_SENT = '409011: Invitation already sent';
export const INVALID_INVITE_RECIPIENT = '409012: Invalid invite recipient';
export const AGE_OUT_OF_RANGE = '409013: Age out of range';
export const ACCOUNT_ALREADY_CHILD = '409014: Account is already child';
export const EMAIL_EXIST = '409015: User with this email already exist';
export const TEAM_TOURNAMENT_CONFLICT =
  '409016: Team is already in tournament event';
export const ORGANIZATION_VERIFIED_CONFLICT =
  '409017: Organization is already verified';
export const USER_VERIFIED_CONFLICT = '409018: User is already verified';
export const USER_WITHOUT_PASSWORD = '409019: User does not have a password';
export const USER_ALREADY_HAVE_PASSWORD = '409020: User already has a password';
export const STAT_ALREADY_COLLECTED =
  '409021: Can not collect statistics twice';
export const STAT_NOT_COLLECTED =
  '409022: Can not discard statistics: it was not collected';
export const FOLLOW_REQUEST_ALREADY_EXISTS =
  '409023: Follow request already exists';
export const CAN_NOT_FOLLOW = '409024: Can not follow';
export const CAN_NOT_UNFOLLOW = '409025: Can not unfollow';
export const USER_ALREADY_FOLLOWING = '409026: User already following';
export const INVITE_NOT_AVAILABLE = '409026: Invite not available';

export const RATE_LIMIT_EXCEEDED = '429000: Rate limit exceeded';

export const VALIDATION_ERROR = '422000: Validation error';

export const INTERNAL_SERVER_ERROR = '500000: Internal server error';
