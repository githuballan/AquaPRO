const resetNotice = document.getElementById('resetNotice');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const resetIntro = document.getElementById('resetIntro');
const resetPageSupabaseUrl = document.body?.dataset.supabaseUrl || '';
const resetPageSupabaseAnonKey = document.body?.dataset.supabaseAnonKey || '';
const resetPasswordClient = window.supabase?.createClient && resetPageSupabaseUrl && resetPageSupabaseAnonKey
  ? window.supabase.createClient(resetPageSupabaseUrl, resetPageSupabaseAnonKey)
  : null;

const RESET_PASSWORD_MAX_LENGTH = 72;
const RESET_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;
const RESET_PASSWORD_HELP_TEXT = 'Use de 8 a 72 caracteres com pelo menos uma letra maiúscula, uma minúscula e um número.';

function showResetNotice(message, type) {
  if (!resetNotice) {
    return;
  }

  resetNotice.textContent = message;
  resetNotice.className = `notice ${type}`;
}

function getResetPasswordToggleIcon(isVisible) {
  if (isVisible) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 3l18 18"></path>
        <path d="M10.6 10.6a2 2 0 1 0 2.8 2.8"></path>
        <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9.6 4.2 10.9 8-0.5 1.5-1.6 3.2-3.2 4.7"></path>
        <path d="M6.2 6.2C4.2 7.6 2.9 9.8 2 12c1.3 3.8 5.4 8 10 8 1.4 0 2.8-0.3 4-0.8"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M2 12s3.6-8 10-8 10 8 10 8-3.6 8-10 8-10-8-10-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;
}

function updateResetPasswordToggleButton(button, isVisible) {
  if (!button) {
    return;
  }

  button.innerHTML = getResetPasswordToggleIcon(isVisible);
  button.setAttribute('aria-label', isVisible ? 'Ocultar senha' : 'Mostrar senha');
  button.setAttribute('title', isVisible ? 'Ocultar senha' : 'Mostrar senha');
  button.classList.toggle('is-visible', isVisible);
}

function showResetForm() {
  resetPasswordForm?.classList.remove('hidden');
  resetIntro?.classList.add('hidden');
}

function validateResetPasswordStrength(password) {
  const normalizedPassword = String(password || '');

  if (!normalizedPassword) {
    return 'Preencha a nova senha.';
  }

  if (normalizedPassword.length < 8) {
    return 'A nova senha deve ter pelo menos 8 caracteres.';
  }

  if (normalizedPassword.length > RESET_PASSWORD_MAX_LENGTH) {
    return `A nova senha deve ter no máximo ${RESET_PASSWORD_MAX_LENGTH} caracteres.`;
  }

  if (!RESET_PASSWORD_PATTERN.test(normalizedPassword)) {
    return RESET_PASSWORD_HELP_TEXT;
  }

  return '';
}

function updateResetCounter(field, counter) {
  const maxLength = Number(field?.getAttribute('maxlength'));
  if (!field || !counter || !Number.isFinite(maxLength) || maxLength <= 0) {
    return;
  }

  const currentLength = field.value.length;
  const remaining = maxLength - currentLength;
  counter.textContent = `${currentLength}/${maxLength}`;
  counter.classList.toggle('is-near-limit', remaining <= Math.max(10, Math.floor(maxLength * 0.1)));
}

function initResetPasswordCounters() {
  resetPasswordForm?.querySelectorAll('input[maxlength]').forEach((field) => {
    if (field.dataset.counterReady === 'true') {
      return;
    }

    const counter = document.createElement('div');
    counter.className = 'field-counter';
    counter.setAttribute('aria-live', 'polite');

    const anchor = field.closest('.password-input-wrapper') || field;
    anchor.insertAdjacentElement('afterend', counter);

    field.addEventListener('input', () => {
      field.setCustomValidity('');
      updateResetCounter(field, counter);
    });

    field.addEventListener('change', () => {
      field.setCustomValidity('');
      updateResetCounter(field, counter);
    });

    updateResetCounter(field, counter);
    field.dataset.counterReady = 'true';
  });
}

async function handleResetPasswordSubmit(event) {
  event.preventDefault();

  if (!resetPasswordClient || !resetPasswordForm) {
    showResetNotice('Não foi possível inicializar a redefinição de senha.', 'alert');
    return;
  }

  const formData = new FormData(resetPasswordForm);
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (!resetPasswordForm.reportValidity()) {
    return;
  }

  if (!password || !confirmPassword) {
    showResetNotice('Preencha os dois campos de senha.', 'alert');
    return;
  }

  const passwordValidationMessage = validateResetPasswordStrength(password);
  if (passwordValidationMessage) {
    resetPasswordForm.querySelector('[name="password"]')?.setCustomValidity(passwordValidationMessage);
    resetPasswordForm.reportValidity();
    showResetNotice(passwordValidationMessage, 'alert');
    return;
  }

  if (password !== confirmPassword) {
    resetPasswordForm.querySelector('[name="confirmPassword"]')?.setCustomValidity('As senhas não coincidem.');
    resetPasswordForm.reportValidity();
    showResetNotice('As senhas não coincidem.', 'alert');
    return;
  }

  const { error } = await resetPasswordClient.auth.updateUser({ password });

  if (error) {
    showResetNotice('Não foi possível atualizar sua senha agora.', 'alert');
    return;
  }

  resetPasswordForm.reset();
  showResetNotice('Senha atualizada com sucesso. Você já pode voltar e entrar com a nova senha.', 'success');
  window.setTimeout(() => {
    window.location.href = 'members.html';
  }, 1800);
}

async function initResetPasswordPage() {
  if (!resetPasswordClient) {
    showResetNotice('Não foi possível carregar o Supabase nesta página.', 'alert');
    return;
  }

  resetPasswordClient.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session?.user)) {
      showResetForm();
      showResetNotice('Sessão de recuperação validada. Cadastre sua nova senha.', 'success');
    }
  });

  const { data, error } = await resetPasswordClient.auth.getSession();

  if (error) {
    showResetNotice('Não foi possível validar o link de recuperação.', 'alert');
    return;
  }

  if (data.session?.user) {
    showResetForm();
    showResetNotice('Sessão de recuperação validada. Cadastre sua nova senha.', 'success');
  } else {
    showResetNotice('Abra esta página a partir do link enviado ao seu e-mail para redefinir a senha.', 'alert');
  }

  document.querySelectorAll('.password-toggle-btn').forEach((button) => {
    updateResetPasswordToggleButton(button, false);

    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);

      if (!input) {
        return;
      }

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      updateResetPasswordToggleButton(button, isPassword);
    });
  });

  initResetPasswordCounters();

  resetPasswordForm?.addEventListener('submit', handleResetPasswordSubmit);
}

window.addEventListener('DOMContentLoaded', initResetPasswordPage);