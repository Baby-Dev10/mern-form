// Type definitions for Google Identity Services
declare namespace google.accounts.id {
  interface IdConfiguration {
    client_id: string;
    auto_select?: boolean;
    callback?: (response: CredentialResponse) => void;
    login_uri?: string;
    native_callback?: Function;
    cancel_on_tap_outside?: boolean;
    prompt_parent_id?: string;
    nonce?: string;
    context?: string;
    state_cookie_domain?: string;
    ux_mode?: string;
    allowed_parent_origin?: string | string[];
    intermediate_iframe_close_callback?: Function;
  }

  interface CredentialResponse {
    credential: string;
    select_by: string;
  }

  function initialize(config: IdConfiguration): void;
  function prompt(callback?: Function): void;
  function renderButton(element: HTMLElement, options: ButtonOptions): void;
  function disableAutoSelect(): void;
  function storeCredential(credential: any, callback: Function): void;
  function revoke(hint: string, callback: Function): void;
  function cancel(): void;

  interface ButtonOptions {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: number;
    locale?: string;
  }
}
