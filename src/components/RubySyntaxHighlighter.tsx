import React from "react";

interface RubySyntaxHighlighterProps {
  code: string;
}

// Ruby keywords
const KEYWORDS = [
  'def', 'end', 'class', 'module', 'if', 'elsif', 'else', 'unless', 'case', 'when',
  'while', 'until', 'for', 'do', 'begin', 'rescue', 'ensure', 'raise', 'return',
  'yield', 'break', 'next', 'redo', 'retry', 'in', 'then', 'and', 'or', 'not',
  'self', 'super', 'nil', 'true', 'false', 'require', 'require_relative', 'include',
  'extend', 'attr_reader', 'attr_writer', 'attr_accessor', 'private', 'protected',
  'public', 'lambda', 'proc', 'new'
];

// Common Ruby methods
const METHODS = [
  'puts', 'print', 'p', 'gets', 'each', 'map', 'select', 'reject', 'find', 'reduce',
  'inject', 'sort', 'sort_by', 'reverse', 'length', 'size', 'count', 'first', 'last',
  'push', 'pop', 'shift', 'unshift', 'join', 'split', 'strip', 'chomp', 'to_s', 'to_i',
  'to_f', 'to_a', 'to_h', 'round', 'abs', 'sum', 'max', 'min', 'any?', 'all?', 'none?',
  'empty?', 'nil?', 'include?', 'is_a?', 'respond_to?', 'send', 'method', 'instance_of?',
  'zip', 'flatten', 'compact', 'uniq', 'sample', 'shuffle', 'take', 'drop', 'group_by',
  'partition', 'times', 'upto', 'downto', 'step', 'loop', 'catch', 'throw', 'sprintf',
  'format', 'gsub', 'sub', 'match', 'scan', 'tr', 'delete', 'squeeze', 'upcase', 'downcase',
  'capitalize', 'swapcase', 'center', 'ljust', 'rjust', 'start_with?', 'end_with?',
  'between?', 'clamp', 'keys', 'values', 'merge', 'fetch', 'dig', 'slice', 'transform_keys',
  'transform_values', 'invert', 'to_json', 'parse', 'write', 'read', 'open', 'close',
  'transaction_begin', 'transaction_commit', 'row_objects', 'new_row_object', 'strftime'
];

const tokenize = (code: string): { type: string; value: string }[] => {
  const tokens: { type: string; value: string }[] = [];
  let i = 0;

  while (i < code.length) {
    // Comments (# to end of line)
    if (code[i] === '#') {
      let comment = '';
      while (i < code.length && code[i] !== '\n') {
        comment += code[i];
        i++;
      }
      tokens.push({ type: 'comment', value: comment });
      continue;
    }

    // Strings (single and double quotes)
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      let str = quote;
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\' && i + 1 < code.length) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      if (i < code.length) {
        str += code[i];
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }

    // Heredoc strings (<<-CODE or <<~CODE)
    if (code.substring(i, i + 2) === '<<') {
      let heredoc = '<<';
      i += 2;
      while (i < code.length && code[i] !== '\n') {
        heredoc += code[i];
        i++;
      }
      tokens.push({ type: 'string', value: heredoc });
      continue;
    }

    // Symbols (:symbol)
    if (code[i] === ':' && i + 1 < code.length && /[a-zA-Z_]/.test(code[i + 1])) {
      let symbol = ':';
      i++;
      while (i < code.length && /[a-zA-Z0-9_?!]/.test(code[i])) {
        symbol += code[i];
        i++;
      }
      tokens.push({ type: 'symbol', value: symbol });
      continue;
    }

    // Numbers (integers and floats)
    if (/[0-9]/.test(code[i]) || (code[i] === '-' && i + 1 < code.length && /[0-9]/.test(code[i + 1]))) {
      let num = '';
      if (code[i] === '-') {
        num = '-';
        i++;
      }
      while (i < code.length && /[0-9._]/.test(code[i])) {
        num += code[i];
        i++;
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // Instance variables (@var)
    if (code[i] === '@') {
      let ivar = '@';
      i++;
      if (code[i] === '@') {
        ivar += '@';
        i++;
      }
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
        ivar += code[i];
        i++;
      }
      tokens.push({ type: 'instance-var', value: ivar });
      continue;
    }

    // Global variables ($var)
    if (code[i] === '$') {
      let gvar = '$';
      i++;
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
        gvar += code[i];
        i++;
      }
      tokens.push({ type: 'global-var', value: gvar });
      continue;
    }

    // Words (identifiers, keywords, methods)
    if (/[a-zA-Z_]/.test(code[i])) {
      let word = '';
      while (i < code.length && /[a-zA-Z0-9_?!]/.test(code[i])) {
        word += code[i];
        i++;
      }
      
      if (KEYWORDS.includes(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (METHODS.includes(word)) {
        tokens.push({ type: 'method', value: word });
      } else if (word[0] === word[0].toUpperCase() && /[A-Z]/.test(word[0])) {
        tokens.push({ type: 'class', value: word });
      } else {
        tokens.push({ type: 'identifier', value: word });
      }
      continue;
    }

    // Operators and punctuation
    if (/[+\-*\/%=<>!&|^~?:]/.test(code[i])) {
      let op = code[i];
      i++;
      // Handle multi-character operators
      while (i < code.length && /[=<>&|]/.test(code[i])) {
        op += code[i];
        i++;
      }
      tokens.push({ type: 'operator', value: op });
      continue;
    }

    // Brackets and punctuation
    if (/[(){}\[\],;.]/.test(code[i])) {
      tokens.push({ type: 'punctuation', value: code[i] });
      i++;
      continue;
    }

    // Whitespace and newlines
    if (/\s/.test(code[i])) {
      let ws = '';
      while (i < code.length && /\s/.test(code[i])) {
        ws += code[i];
        i++;
      }
      tokens.push({ type: 'whitespace', value: ws });
      continue;
    }

    // Catch-all for any other character
    tokens.push({ type: 'text', value: code[i] });
    i++;
  }

  return tokens;
};

const getTokenClassName = (type: string): string => {
  switch (type) {
    case 'comment':
      return 'text-slate-500 italic';
    case 'string':
      return 'text-amber-400';
    case 'symbol':
      return 'text-pink-400';
    case 'number':
      return 'text-purple-400';
    case 'keyword':
      return 'text-red-400 font-semibold';
    case 'method':
      return 'text-blue-400';
    case 'class':
      return 'text-yellow-300';
    case 'instance-var':
      return 'text-cyan-400';
    case 'global-var':
      return 'text-orange-400';
    case 'operator':
      return 'text-slate-400';
    case 'punctuation':
      return 'text-slate-400';
    case 'identifier':
      return 'text-slate-200';
    default:
      return 'text-slate-300';
  }
};

export const RubySyntaxHighlighter: React.FC<RubySyntaxHighlighterProps> = ({ code }) => {
  const tokens = tokenize(code);

  return (
    <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto leading-relaxed">
      <code>
        {tokens.map((token, index) => (
          <span key={index} className={getTokenClassName(token.type)}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  );
};

export default RubySyntaxHighlighter;
