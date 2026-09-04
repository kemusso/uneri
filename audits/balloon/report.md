# audit(auto): balloon  2026-09-04

verdict: **FAIL**

| variant | vw | pixel diff % | box Δ (w/h) | style diffs | pass |
|---|---|---|---|---|---|
| left | 375 | 0 | 0/0 | 0 | ✅ |
| right | 375 | 0 | 0/0 | 0 | ✅ |
| think | 375 | 0 | 0/0 | 0 | ✅ |
| border | 375 | 0 | 0/0 | 0 | ✅ |
| square | 375 | 0 | 0/0 | 0 | ✅ |
| col-red | 375 | 0 | 0/0 | 0 | ✅ |
| col-blue | 375 | 0 | 0/0 | 0 | ✅ |
| col-green | 375 | 0 | 0/0 | 0 | ✅ |
| col-yellow | 375 | 0 | 0/0 | 0 | ✅ |
| think-border | 375 | 0.12 | 0/0 | 6 | ❌ |
| rich | 375 | 0 | 0/0 | 0 | ✅ |
| nested | 375 | 0.135 | 0/0 | 43 | ❌ |
| left | 768 | 0 | 0/0 | 0 | ✅ |
| right | 768 | 0 | 0/0 | 0 | ✅ |
| think | 768 | 0 | 0/0 | 0 | ✅ |
| border | 768 | 0 | 0/0 | 0 | ✅ |
| square | 768 | 0 | 0/0 | 0 | ✅ |
| col-red | 768 | 0 | 0/0 | 0 | ✅ |
| col-blue | 768 | 0 | 0/0 | 0 | ✅ |
| col-green | 768 | 0 | 0/0 | 0 | ✅ |
| col-yellow | 768 | 0 | 0/0 | 0 | ✅ |
| think-border | 768 | 0.051 | 0/0 | 6 | ❌ |
| rich | 768 | 0 | 0/0 | 0 | ✅ |
| nested | 768 | 0.059 | 0/0 | 43 | ❌ |
| left | 1200 | 0 | 0/0 | 0 | ✅ |
| right | 1200 | 0 | 0/0 | 0 | ✅ |
| think | 1200 | 0 | 0/0 | 0 | ✅ |
| border | 1200 | 0 | 0/0 | 0 | ✅ |
| square | 1200 | 0 | 0/0 | 0 | ✅ |
| col-red | 1200 | 0 | 0/0 | 0 | ✅ |
| col-blue | 1200 | 0 | 0/0 | 0 | ✅ |
| col-green | 1200 | 0 | 0/0 | 0 | ✅ |
| col-yellow | 1200 | 0 | 0/0 | 0 | ✅ |
| think-border | 1200 | 0.041 | 0/0 | 6 | ❌ |
| rich | 1200 | 0 | 0/0 | 0 | ✅ |
| nested | 1200 | 0.046 | 0/0 | 43 | ❌ |

## style diffs

### think-border @375
| element | prop | ref | impl |
|---|---|---|---|
| `div>div[0]>div[1]>div[0]>span[1]>span[0]` | right | `13px` | `0px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[0]` | left | `-21px` | `-8px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | width | `12px` | `10px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | height | `12px` | `16px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | right | `4px` | `6px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | bottom | `-20px` | `-24px` |

### nested @375
| element | prop | ref | impl |
|---|---|---|---|
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | background-color | `rgb(255, 235, 235)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-right-width | `1px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-right-color | `rgb(244, 135, 137)` | `rgb(255, 235, 235)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-left-width | `1px` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-left-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | width | `8px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | height | `8px` | `16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | right | `13px` | `-2px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | bottom | `-8px` | `-16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | left | `-21px` | `-8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | background-color | `rgb(255, 235, 235)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-right-width | `1px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-left-width | `1px` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-left-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | display | `none` | `block` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | width | `12px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | height | `12px` | `16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | top | `8px` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | right | `auto` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | bottom | `auto` | `-16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | left | `-16px` | `-10px` |
| `div>div[0]>div[1]>div[0]>span[2]>span[0]` | right | `13px` | `0px` |
| `div>div[0]>div[1]>div[0]>span[2]>span[0]` | left | `-21px` | `-8px` |
| `div>div[0]>div[1]>div[0]>span[2]>span[1]` | width | `12px` | `10px` |
| … | 3 more | | |

### think-border @768
| element | prop | ref | impl |
|---|---|---|---|
| `div>div[0]>div[1]>div[0]>span[1]>span[0]` | right | `13px` | `0px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[0]` | left | `-21px` | `-8px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | width | `12px` | `10px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | height | `12px` | `16px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | right | `4px` | `6px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | bottom | `-20px` | `-24px` |

### nested @768
| element | prop | ref | impl |
|---|---|---|---|
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | background-color | `rgb(255, 235, 235)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-right-width | `1px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-right-color | `rgb(244, 135, 137)` | `rgb(255, 235, 235)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-left-width | `1px` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-left-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | width | `8px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | height | `8px` | `16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | right | `13px` | `-2px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | bottom | `-8px` | `-16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | left | `-21px` | `-8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | background-color | `rgb(255, 235, 235)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-right-width | `1px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-left-width | `1px` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-left-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | display | `none` | `block` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | width | `12px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | height | `12px` | `16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | top | `8px` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | right | `auto` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | bottom | `auto` | `-16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | left | `-16px` | `-10px` |
| `div>div[0]>div[1]>div[0]>span[2]>span[0]` | right | `13px` | `0px` |
| `div>div[0]>div[1]>div[0]>span[2]>span[0]` | left | `-21px` | `-8px` |
| `div>div[0]>div[1]>div[0]>span[2]>span[1]` | width | `12px` | `10px` |
| … | 3 more | | |

### think-border @1200
| element | prop | ref | impl |
|---|---|---|---|
| `div>div[0]>div[1]>div[0]>span[1]>span[0]` | right | `13px` | `0px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[0]` | left | `-21px` | `-8px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | width | `12px` | `10px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | height | `12px` | `16px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | right | `4px` | `6px` |
| `div>div[0]>div[1]>div[0]>span[1]>span[1]` | bottom | `-20px` | `-24px` |

### nested @1200
| element | prop | ref | impl |
|---|---|---|---|
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | background-color | `rgb(255, 235, 235)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-right-width | `1px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-right-color | `rgb(244, 135, 137)` | `rgb(255, 235, 235)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-left-width | `1px` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-left-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-top-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | border-bottom-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | width | `8px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | height | `8px` | `16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | right | `13px` | `-2px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | bottom | `-8px` | `-16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[0]` | left | `-21px` | `-8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | background-color | `rgb(255, 235, 235)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-right-width | `1px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-width | `1px` | `8px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-left-width | `1px` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-left-color | `rgb(244, 135, 137)` | `rgba(0, 0, 0, 0)` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-top-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-left-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | border-bottom-right-radius | `50%` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | display | `none` | `block` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | width | `12px` | `10px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | height | `12px` | `16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | top | `8px` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | right | `auto` | `0px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | bottom | `auto` | `-16px` |
| `div>div[0]>div[1]>div[0]>div[1]>div[1]>div[0]>span[1]>span[1]` | left | `-16px` | `-10px` |
| `div>div[0]>div[1]>div[0]>span[2]>span[0]` | right | `13px` | `0px` |
| `div>div[0]>div[1]>div[0]>span[2]>span[0]` | left | `-21px` | `-8px` |
| `div>div[0]>div[1]>div[0]>span[2]>span[1]` | width | `12px` | `10px` |
| … | 3 more | | |
