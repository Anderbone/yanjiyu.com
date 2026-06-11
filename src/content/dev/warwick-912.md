---
title: "Sensor network module outline"
description: "Warwick module 912 sensor network outline notes."
date: 2018-12-19
author: "Jiyu Yan"
categories: ["University"]
tags: ["Warwick", "Sensor Networks"]
draft: true
---

For Warwick University module 912, sensor network.

### Link quality estimation 2

- link monitor
  - active
    - A node monitors the links to its neighbours by sending probe packets.
  - passive
    - Passive link monitoring exploits existing traffic without incurring additional communication overhead.
    - A node listens to transmitted packets (even if these packets are not addressed to it). Process called (over-hearing). can also listen to ack sent by neighbours. lack up-to-date.

### Data link layer 3

- hidden, exposed
- CSMA/CA
- MACAW
- `IEEE802.11`

#### IEEE802.15.4

    - combines contention-based (CSMA/CA) and reservation-based schemes (guaranteed time slots - GTS).FFD,RFD. Beacon-enabled(CAP,GTS), non-beaconed mode.

- the reservation process
  - Sending A request packet (RP) specifies if the requested slot is for TX or RX, and the # of contiguous slots (GTS), during CAP to CO
  - CO allocates slots and informs in one of next beacons
  - A tracks beacons from CO for time t < pT, next beacon with allocation?

- TDMA

### Network layer 4

- `flooding and gossip(smart), DV, LSR`
- proactive or table-driven: DSDV, OLSR
  - `DSDV(sparse)`
  - notify neighbours when DV changes
  - link breakage: sequence number +1 to odd, metric set to infinity
  - `OLSR(dense)`
  - periodically flood status of their one-hop links
  - MPRSet
- reactive or on-demand:DSR AODV TORA
  - DSR
  - `RR, RRp, full path, promiscuous mode, RE sent back to S for breakage(then flood RR if no available)`
  - AODV
  - pointer to next node, RR towards source, RRp towards destination.
  - sequence number: maintain the most recent routing info
  - link breakage: unsolicited RR with updated sequence number and metric, send to active node. update cache. S initial new route discovery with updated s and d sequence number
  - TORA:loop free, link reverse algorithm
  - QRY flood to D, UDP back
  - partition easily detected

- Routing for WSNs
  - Data centric, Rumor routing
  - hierarchical, LEACH, selects nodes as cluster heads
  - geographical
  - QoS

### Trickle 5

- properties for code propagation protocol
  - low maintenance
  - rapid propagation
  - scalability

- Rule 1: When a mote hears that a neighbor has older metadata, it brings everyone nearby up to date by broadcasting the needed pieces of code.
- Rule 2: When a mote hears that it is behind the times, it repeats the latest news it knows of (its own metadata). Subsequently, following R1, this triggers motes with newer code to broadcast it.

### CTP 6

- Intended to be robust to stale route information and agile to link dynamics
- `1.datapath validation`
- `2.adaptive beaconing:`
  - Updates of stale routing information by sending control beacons.
  - **it uses the routing cost gradient to control when to reset the timer interval**.
- resetting interval
- detects stale info or loops.
- Its routing cost decreases significantly
- It receives a packet with the Pull (P) bit set

### Reprogramming 7

- MNP: ADV, DLR
- Dominating sets, MCDS

Why keeping track of the no. of requests?

- 1.Sources with a higher number of potential receivers are assigned higher priority ! avoid transmitting the same code by too many nodes
- 2.Sleeping is used to reduce energy consumption ! a source can go to sleep when a neighbor with higher priority has data to send
- `3.In a neighborhood, there is at most one sender transmitting the code at any given time`

### Failure Detection 8

- A failure detector is a distributed oracle that provide processes with suspicions about crashed processes.
- `timing assumptions(sync systems)`
  - processing time bounded
  - upper bound limit delay to transmit
  - clocks, bounded
- strong completeness: Eventually, every crashed process is permanently detected by every correct process.
- strong accuracy:No process is suspected by any process before it has crashed.
- perfect
- heartbeat

### NVC

- NVC: The ability for nodes in a given neighborhood to agree on what nodes are alive and what nodes are unreachable.
- safety:A working node is never removed (from a neighbourhood).
- liveness:Every time a node m fails, then eventually ∀n : m ∈ N : n removes m.
- Split Strong NVC into two parts: (i) neighbourhood monitoring and (ii) view consistency enforcement.
- PCD/LCD
  - strong accuracy:No working process n is incorrectly suspected to have pseudocrashed with neighborhood N̂.
  - strong completeness:Every time a process n pseudocrashes, it will eventually be suspected with some(most recent neighborhood) neighborhood N̂

#### Eventual , to implement perfect PCD during memory failures

- eventual strong accuracy: There is a time after which no working process n is incorrectly suspected with neighborhood N̂.
- eventual strong completeness:There is a time after which, when a process n pseudocrashes, eventually n will be suspected with some neighborhood N̂.
