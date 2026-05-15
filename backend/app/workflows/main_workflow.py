from typing import TypedDict, Annotated, Sequence
import operator
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage
from app.agents.intake import run_intake_agent
from app.agents.scribe import run_scribe_agent

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_agent: str
    patient_id: int
    consultation_id: int
    task: str

async def supervisor_node(state: AgentState):
    # This node routes to the appropriate agent
    task = state.get("task")
    if task == "intake":
        return {"next_agent": "intake"}
    elif task == "scribe":
        return {"next_agent": "scribe"}
    else:
        return {"next_agent": END}

async def intake_node(state: AgentState):
    # Call intake agent logic
    # (Simplified for now)
    return {"messages": [BaseMessage(content="Intake complete", type="ai")]}

async def scribe_node(state: AgentState):
    # Call scribe agent logic
    return {"messages": [BaseMessage(content="Scribing complete", type="ai")]}

workflow = StateGraph(AgentState)
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("intake", intake_node)
workflow.add_node("scribe", scribe_node)

workflow.set_entry_point("supervisor")

workflow.add_conditional_edges(
    "supervisor",
    lambda state: state["next_agent"],
    {
        "intake": "intake",
        "scribe": "scribe",
        END: END
    }
)

workflow.add_edge("intake", "supervisor")
workflow.add_edge("scribe", "supervisor")

app_workflow = workflow.compile()
