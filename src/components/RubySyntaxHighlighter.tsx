import React, { useState } from "react";
import { Hash, ToggleLeft, ToggleRight } from "lucide-react";

interface RubySyntaxHighlighterProps {
  code: string;
  defaultShowLineNumbers?: boolean;
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

export const RubySyntaxHighlighter: React.FC<RubySyntaxHighlighterProps> = ({ 
  code, 
  defaultShowLineNumbers = true 
}) => {
  const [showLineNumbers, setShowLineNumbers] = useState(defaultShowLineNumbers);
  const tokens = tokenize(code);
  
  // Split code into lines for line numbering
  const lines = code.split('\n');
  const lineCount = lines.length;
  const lineNumberWidth = String(lineCount).length;

  // Group tokens by line
  const tokensByLine: { type: string; value: string }[][] = [];
  let currentLine: { type: string; value: string }[] = [];
  
  tokens.forEach(token => {
    if (token.type === 'whitespace' && token.value.includes('\n')) {
      // Split whitespace tokens that contain newlines
      const parts = token.value.split('\n');
      parts.forEach((part, index) => {
        if (part) {
          currentLine.push({ type: 'whitespace', value: part });
        }
        if (index < parts.length - 1) {
          tokensByLine.push(currentLine);
          currentLine = [];
        }
      });
    } else {
      currentLine.push(token);
    }
  });
  
  // Don't forget the last line
  if (currentLine.length > 0 || tokensByLine.length < lineCount) {
    tokensByLine.push(currentLine);
  }

  return (
    <div className="text-xs font-mono leading-relaxed">
      {/* Line Numbers Toggle */}
      <button
        onClick={() => setShowLineNumbers(!showLineNumbers)}
        className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50 w-full justify-end hover:opacity-80 transition-opacity"
      >
        <Hash className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs text-slate-400">Line numbers</span>
        {showLineNumbers ? (
          <ToggleRight className="w-5 h-5 text-emerald-500" />
        ) : (
          <ToggleLeft className="w-5 h-5 text-slate-500" />
        )}
      </button>
      
      {showLineNumbers ? (
        <table className="w-full border-collapse">
          <tbody>
            {tokensByLine.map((lineTokens, lineIndex) => (
              <tr key={lineIndex} className="hover:bg-slate-800/50">
                <td className="select-none text-right pr-4 text-slate-600 align-top w-8 border-r border-slate-700/50">
                  {String(lineIndex + 1).padStart(lineNumberWidth, ' ')}
                </td>
                <td className="pl-4 whitespace-pre-wrap break-all">
                  {lineTokens.length > 0 ? (
                    lineTokens.map((token, tokenIndex) => (
                      <span key={tokenIndex} className={getTokenClassName(token.type)}>
                        {token.value}
                      </span>
                    ))
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="whitespace-pre-wrap break-all">
          {tokensByLine.map((lineTokens, lineIndex) => (
            <div key={lineIndex} className="hover:bg-slate-800/50 px-2">
              {lineTokens.length > 0 ? (
                lineTokens.map((token, tokenIndex) => (
                  <span key={tokenIndex} className={getTokenClassName(token.type)}>
                    {token.value}
                  </span>
                ))
              ) : (
                <span>&nbsp;</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RubySyntaxHighlighter;
