import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";

import { UserModel } from "models/user.model";
import { UserRoles } from ".";

type Actions = "list" | "create" | "read" | "update" | "delete" | "manage";
type Subjects = "UserModel" | "PostModel" | "all";

type AppAbility = Ability<[Actions, Subjects]>;
type AppAbilityBuilder = AbilityBuilder<AppAbility>;

let ANONYMOUS_ABILITY: Ability;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export const defineAbilityFor = (user: UserModel) => {
  if (user) {
    return new Ability(defineRulesFor(user));
  }

  if (!ANONYMOUS_ABILITY) {
    ANONYMOUS_ABILITY = new Ability(defineRulesFor());
  }

  return ANONYMOUS_ABILITY;
};

function defineRulesFor(user?: UserModel) {
  const builder: AppAbilityBuilder = new AbilityBuilder(AppAbility);

  switch (user?.role) {
    case UserRoles.admin:
      defineAdminRules(builder);
      break;
    case UserRoles.user:
      defineAnonymousRules(builder);
      defineUserRules(builder, user);
      break;
    default:
      defineAnonymousRules(builder);
      break;
  }

  return builder.rules;
}

function defineAdminRules({ can }: AppAbilityBuilder) {
  can("manage", "all");
}

function defineUserRules({ can }: AppAbilityBuilder, user: UserModel) {
  // @ts-ignore-next-line
  can(["read", "delete", "update"], "UserModel", { id: user.id });
  // @ts-ignore-next-line
  can(["delete", "update", "read"], "PostModel", { authorId: user.id });
  can(["list", "create"], "PostModel");
}

function defineAnonymousRules({ can }: AbilityBuilder<Ability>) {
  can(["list", "create"], "UserModel");
}
